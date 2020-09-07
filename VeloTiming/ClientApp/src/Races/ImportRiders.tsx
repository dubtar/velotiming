import { Modal, Form, Button } from "react-bootstrap"
import React from "react"

const InitialState = {
    fileContent: null as string | null 
}

type Props = { show: boolean, onHide: () => void }

export default class ImportRiders extends React.Component<Props, typeof InitialState> {
    /**
     *
     */
    constructor(props: Props) {
        super(props)
        this.state = InitialState
        this.onSelect = this.onSelect.bind(this)
    }

    public render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} size="xl">
                <Modal.Header>
                    <Modal.Title>Импорт участников из CSV</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.File
                                label="CSV Файл для импорта" onChange={this.onSelect}
                                pattern="*.csv"
                            />
                        </Form.Group>
                    </Form>
                    {this.state.fileContent && 
                        <Form.Control as="textarea" rows={2} value={this.state.fileContent} readOnly={true} />
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.onHide}>Отмена</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    private async onSelect(event: React.SyntheticEvent<HTMLInputElement, Event>) {
        if (event.currentTarget.files?.length) {
            const fileContent = await event.currentTarget.files[0].text()
            this.parseList(fileContent)
        } 
    }

    private parseList(fileContent: string) {
        // TODO
        this.setState({fileContent});
    }
}