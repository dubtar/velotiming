import { Modal, Form, Button } from "react-bootstrap"
import React from "react"

const InitialState = {

}

type Props = { show: boolean, onHide: () => void }

export default class ImportRiders extends React.Component<Props, typeof InitialState> {
    /**
     *
     */
    constructor(props: Props) {
        super(props);
        this.state = InitialState;
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
                            <Form.File label="CSV Файл для импорта" />
                        </Form.Group>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.onHide}>Отмена</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}