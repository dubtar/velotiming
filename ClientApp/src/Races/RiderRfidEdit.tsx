
import { Rider } from "./RaceService";
import React, { ChangeEvent } from 'react'
import { Form, Button, Col, FormControl, Row } from 'react-bootstrap'
import * as signalR from "@aspnet/signalr";

const InitialState = {
    rfid: ''
}

type Props = {
    rider: Rider
    onSave: (rfidId: string | undefined, riderId: number) => void
}

export default class RiderRfidEdit extends React.Component<Props, typeof InitialState> {
    constructor(props: Props) {
        super(props)
        this.state = InitialState
        this.onSubmit = this.onSubmit.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    sRconn: signalR.HubConnection | undefined

    componentDidMount() {
        this.sRconn = new signalR.HubConnectionBuilder().withUrl('/rfidHub').build();
        this.sRconn.on("RfidFound", (rfidId: string) => {
            if (!this.state.rfid && rfidId)
                this.setState({ rfid: rfidId });
        })
        this.sRconn.start();
    }

    componentWillUnmount() {
        if (this.sRconn)
            this.sRconn.stop()
    }

    onSubmit(e: React.FormEvent) {
        if (this.state.rfid) {
            this.props.onSave(this.state.rfid, this.props.rider.id)
        }
        e.stopPropagation();
        e.preventDefault();
    }

    onCancel(e: React.FormEvent) {
        this.props.onSave(undefined, 0)
        e.stopPropagation();
        e.preventDefault();
    }

    handleChange(e: React.FormEvent<FormControl>) {
        this.setState({ rfid: (e.target as HTMLInputElement).value })
    }

    render() {
        return (
            <Row><Col>
                <Form onSubmit={this.onSubmit} onReset={this.onCancel} className="mv-3">
                    <Form.Row>
                        <Form.Label className="mr-3" >{this.props.rider.number && `${this.props.rider.number}: `}{this.props.rider.lastName}</Form.Label>
                        <Form.Control as="input" required placeholder="Rfid с датчика" value={this.state.rfid}
                            onChange={this.handleChange} />
                        <Button variant="primary" type="submit">Сохранить</Button>
                        <Button variant="secondary" type="reset">Отменить</Button>
                    </Form.Row>
                </Form>
            </Col></Row>
        );
    }

}