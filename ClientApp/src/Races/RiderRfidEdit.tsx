
import { Rider } from "./RaceService";
import React from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import signalR from "@aspnet/signalr";

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
    }

    sRconn: signalR.HubConnection | undefined

    componentDidMount() {
        this.sRconn = new signalR.HubConnectionBuilder().withUrl('/rfidHub').build();
        this.sRconn.on("RfidFound", (rfidId: string) => {
            if (!this.state.rfid && rfidId) this.setState({ rfid: rfidId });
        })
        this.sRconn.start();
    }

    componentWillUnmount() {
        if (this.sRconn)
            this.sRconn.stop()
    }

    onSubmit() {
        if (this.state.rfid) {
            this.props.onSave(this.state.rfid, this.props.rider.id)
        }
    }

    onCancel() {
        this.props.onSave(undefined, 0)
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} onReset={this.onCancel}>
                <Form.Row>
                    <Form.Label>{this.props.rider.number && `${this.props.rider.number}: `}{this.props.rider.lastName}</Form.Label>
                    <Form.Control as={Col} required placeholder="Rfid с датчика" value={this.state.rfid} />
                    <Button variant="primary" type="submit">Сохранить</Button>
                    <Button variant="secondary" type="reset">Отменить</Button>
                </Form.Row>
            </Form>

        );
    }

}