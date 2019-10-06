import * as signalR from "@aspnet/signalr";
import React from "react";
import { Col, Form, FormControlProps, Row, Button } from "react-bootstrap";
import { INumber } from "./NumberService";

type Props = { number: INumber; onSave: (num?: INumber) => void };

const InitialState = {
  numberId: "",
  rfids: [] as Array<{ selected: boolean; id: string }>
};

export default class EditNumber extends React.Component<
  Props,
  typeof InitialState
> {
  private sRconn: signalR.HubConnection | undefined;
  constructor(props: Props) {
    super(props);
    this.state = {
      numberId: props.number.id || "",
      rfids: props.number.rfids.map(r => ({ selected: true, id: r }))
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onIdChange = this.onIdChange.bind(this);
    this.onRfidClick = this.onRfidClick.bind(this);
  }

  public componentDidMount() {
    this.sRconn = new signalR.HubConnectionBuilder()
      .withUrl("/rfidHub")
      .build();
    this.sRconn.on("RfidFound", (rfidId: string) => {
      if (!this.state.rfids.find(r => r.id === rfidId)) {
        // AddRfid
        const rfids = [
          ...this.state.rfids,
          { selected: this.state.rfids.length === 0, id: rfidId }
        ];
        this.setState({ rfids });
      }
    });
    this.sRconn.start();
  }

  public componentWillUnmount() {
    if (this.sRconn) this.sRconn.stop();
  }

  public render() {
    return (
      <Form onSubmit={this.onSubmit} onReset={this.onReset}>
        <Row>
          <Form.Group as={Col}>
            <Form.Label>Номер</Form.Label>
            <Form.Control
              autoFocus={true}
              type="text"
              required={true}
              value={this.state.numberId}
              onChange={this.onIdChange}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Rfid</Form.Label>
            {this.state.rfids.map(r => (
              <Form.Check
                custom={true}
                type="checkbox"
                checked={r.selected}
                label={r.id}
                id={r.id}
                onChange={this.onRfidClick}
              />
            ))}
          </Form.Group>
        </Row>
        <Row>
          <Button variant="primary" type="submit">
            Сохранить
          </Button>
          <Button variant="secondary" type="reset">
            Отмена
          </Button>
        </Row>
      </Form>
    );
  }

  private onSubmit(e: React.FormEvent) {
    e.stopPropagation();
    e.preventDefault();

    this.props.onSave({
      id: this.state.numberId,
      rfids: this.state.rfids.filter(r => r.selected).map(r => r.id)
    });
  }

  private onReset(e: React.FormEvent) {
    e.stopPropagation();
    this.props.onSave();
  }

  private onIdChange(e: React.FormEvent<FormControlProps>) {
    this.setState({ numberId: (e.target as HTMLInputElement).value });
  }

  private onRfidClick(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const rfidId = target.id;
    const rfids = [...this.state.rfids];
    const rfid = rfids.find(r => r.id === rfidId);
    if (rfid) {
      rfid.selected = target.checked;
    }
    this.setState({ rfids });
  }
}
