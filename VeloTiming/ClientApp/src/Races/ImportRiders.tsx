import { Modal, Form, Button, Table, Alert } from "react-bootstrap"
import React from "react"

const InitialState = {
    fileContent: null as string | null,
    rows: null as string[][] | null,
    skipFirstRow: false,
    columnTypes: [] as string[],
    errors: [] as string[]
}

const COLUMNS = {
    Skip: '',
    Surname: 'surname',
    Name: 'name',
    SurnameName: 'surname name',
    Sex: 'sex',
    Year: 'year',
    City: 'city',
    Team: 'team'
}

type Props = { show: boolean, onHide: () => void }

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
                    <Button variant="primary" onClick={this.import}>Импортировать</Button>
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
        columnTypes[index] = event.currentTarget.value;
        this.setState({ columnTypes })
    }

    private parseList(fileContent: string) {
        const sep = ';'
        const rows = fileContent.split('\n').map((line => line.split(sep)));
        const columnTypes = rows.length ? rows[0].map(_ => '') : []
        this.setState({ fileContent, rows, columnTypes });
    }

    private validateSingle(filter: (type: string) => boolean, label: string, errors: string[]) {
        const surnameCount = this.state.columnTypes.filter(filter).length;
        if (surnameCount === 0) {
            errors.push(`Колонка с ${label} не выбрана`)
        } else if (surnameCount > 1) {
            errors.push(`Колонка с ${label} выбрана более одного раза`)
        }
    }

    private import() {
        const errors: string[] = []
        // Surname check
        this.validateSingle(type => type === COLUMNS.Surname || type === COLUMNS.SurnameName, 'Фамилией', errors)
        this.validateSingle(type => type === COLUMNS.Name || type === COLUMNS.SurnameName, 'Имeнем', errors)

        this.setState({ errors });
        if (errors.length === 0) {
            // TODO: call import on server
            this.props.onHide();
            this.setState({ rows: [], fileContent: null })
        }
    }
}

type ColumnComboProps = { value: string | undefined, onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }

const ColumnCombo: React.SFC<ColumnComboProps> = (props: ColumnComboProps) => {
    return <Form.Control as="select" onChange={props.onChange} value={props.value}>
        <option value='' defaultChecked={true}>Пропустить</option>
        <option value={COLUMNS.Surname}>Фамилия</option>
        <option value={COLUMNS.Name}>Имя</option>
        <option value={COLUMNS.SurnameName}>Фамилия Имя</option>
        <option value={COLUMNS.Sex}>Пол</option>
        <option value={COLUMNS.Year}>Год рождения</option>
        <option value={COLUMNS.City}>Город</option>
        <option value={COLUMNS.Team}>Команда</option>
    </Form.Control>
}