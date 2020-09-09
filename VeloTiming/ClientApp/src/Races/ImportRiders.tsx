import { Modal, Form, Button, Table, Alert } from "react-bootstrap"
import React from "react"
import { RiderClient, RiderImportColumnType, ImportDto } from '../clients'

const InitialState = {
    columnTypes: [] as RiderImportColumnType[],
    errors: [] as string[],
    fileContent: null as string | null,
    isImporting: false,
    rows: null as string[][] | null,
    skipFirstRow: false
}

type Props = { raceId: number, show: boolean, onHide: () => void }

export default class ImportRiders extends React.Component<Props, typeof InitialState> {
    /**
     *
     */
    constructor(props: Props) {
        super(props)
        this.state = InitialState
        this.onFileSelect = this.onFileSelect.bind(this)
        this.onSkipFirstRowCheck = this.onSkipFirstRowCheck.bind(this)
        this.import = this.import.bind(this)
    }

    public render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} size="xl">
                <Modal.Header>
                    <Modal.Title>Импорт участников из CSV</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.errors.length > 0 && <Alert variant="danger">{this.state.errors.map((error, ind) => <li key={ind}>{error}</li>)} </Alert>}
                    {!this.state.fileContent &&
                        <Form>
                            <Form.Group>
                                <Form.File
                                    label="CSV Файл для импорта" onChange={this.onFileSelect}
                                    pattern="*.csv"
                                />
                            </Form.Group>
                        </Form>
                    }
                    {this.state.rows && this.state.rows.length &&
                        (<>
                            <Form.Check type="checkbox" checked={this.state.skipFirstRow} label="Пропускать первую строку" onChange={this.onSkipFirstRowCheck} />
                            <Table striped={true} bordered={true}>
                                <thead>
                                    <tr>
                                        {this.state.columnTypes.map((columnType, ind) =>
                                            <th key={ind}><ColumnCombo value={columnType} onChange={this.onColumnChange.bind(this, ind)} /></th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.rows.slice(this.state.skipFirstRow ? 1 : 0, 6).map((row, ind) =>
                                        <tr key={ind}>
                                            {row.map((cell, cind) => <td key={cind}>{cell}</td>)}
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </>)
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" disabled={!this.state.fileContent || this.state.isImporting} onClick={this.import}>Импортировать</Button>
                    <Button variant="secondary" onClick={this.props.onHide}>Отмена</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    private async onFileSelect(event: React.SyntheticEvent<HTMLInputElement, Event>) {
        if (event.currentTarget.files?.length) {
            const fileContent = await event.currentTarget.files[0].text()
            this.parseList(fileContent)
        }
    }

    private onSkipFirstRowCheck(_: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ skipFirstRow: !this.state.skipFirstRow })
    }

    private onColumnChange(index: number, event: React.ChangeEvent<HTMLInputElement>) {
        const columnTypes = this.state.columnTypes
        columnTypes[index] = RiderImportColumnType[event.currentTarget.value as keyof typeof RiderImportColumnType];
        this.setState({ columnTypes })
    }

    private parseList(fileContent: string) {
        const sep = ';'
        const rows = fileContent.split('\n').map((line => line.split(sep)));
        const columnTypes = rows.length ? rows[0].map(_ => RiderImportColumnType.Skip) : []
        this.setState({ fileContent, rows, columnTypes });
    }

    private validateSingle(filter: (type: RiderImportColumnType | undefined) => boolean, label: string, errors: string[]) {
        const surnameCount = this.state.columnTypes.filter(filter).length;
        if (surnameCount === 0) {
            errors.push(`Колонка с ${label} не выбрана`)
        } else if (surnameCount > 1) {
            errors.push(`Колонка с ${label} выбрана более одного раза`)
        }
    }

    private async import() {
        const errors: string[] = []
        // Surname check
        this.validateSingle(type => type !== undefined && [RiderImportColumnType.Lastname, RiderImportColumnType.LastFirstName, RiderImportColumnType.FirstLastName].includes(type),
            'Фамилией', errors)
        this.validateSingle(type => type !== undefined && [RiderImportColumnType.FirstName, RiderImportColumnType.FirstLastName, RiderImportColumnType.LastFirstName].includes(type),
            'Имeнем', errors)

        this.setState({ errors });
        if (errors.length === 0) {
            try {
                const result = await new RiderClient().import(new ImportDto({
                    raceId: this.props.raceId,
                    columnTypes: this.state.columnTypes,
                    content: this.state.fileContent!,
                    ignoreFirstRow: this.state.skipFirstRow
                }))
                // TODO: call import on server
                alert(result);
                this.setState({ rows: [], fileContent: null })
                this.props.onHide();
            }
            catch (err) {
                this.setState({ errors: [err]})
            }
        }
    }
}

type ColumnComboProps = { value: RiderImportColumnType | undefined, onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }

const ColumnCombo: React.SFC<ColumnComboProps> = (props: ColumnComboProps) => {
    return <Form.Control as="select" onChange={props.onChange} value={props.value}>
        <option value='' defaultChecked={true}>Пропустить</option>
        <option value={RiderImportColumnType.Lastname}>Фамилия</option>
        <option value={RiderImportColumnType.FirstName}>Имя</option>
        <option value={RiderImportColumnType.LastFirstName}>Фамилия Имя</option>
        <option value={RiderImportColumnType.FirstLastName}>Имя Фамилия</option>
        <option value={RiderImportColumnType.Sex}>Пол</option>
        <option value={RiderImportColumnType.Year}>Год рождения</option>
        <option value={RiderImportColumnType.City}>Город</option>
        <option value={RiderImportColumnType.Team}>Команда</option>
    </Form.Control>
}