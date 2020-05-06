import * as signalR from "@aspnet/signalr";
import React from "react";
import { Alert, Button, Col, Row, Spinner, Table } from "react-bootstrap";
import EditNumber from "./EditNumber";
import NumberService, { INumber } from "./NumberService";

type Props = {};

const InitialState = {
  editNumber: null as INumber | null,
  error: null as string | null,
  numberInRange: null as string | null,
  numbers: null as INumber[] | null
};

export default class NumberList extends React.Component<
  Props,
  typeof InitialState
> {
  private sRconn: signalR.HubConnection | undefined;

  constructor(props: Props) {
    super(props);
    this.state = InitialState;
    this.addNumber = this.addNumber.bind(this);
    this.saveNumber = this.saveNumber.bind(this);
  }

  public componentWillUnmount() {
    if (this.sRconn) this.sRconn.stop();
  }

  public async componentDidMount() {
    this.sRconn = new signalR.HubConnectionBuilder()
      .withUrl("/rfidHub")
      .build();
    this.sRconn.on("NumberFound", (numberInRange: string) => {
        this.setState({ numberInRange });
    });
    this.sRconn.start();
    try {
      const numbers = await NumberService.GetAllNumbers();
      this.setState({ numbers });
    } catch (ex) {
      this.setState({ error: ex.toString() });
    }
  }

  public addNumber() {
    this.setState({ editNumber: { id: "", rfids: [] } });
  }

  public editNumber(num: INumber) {
    this.setState({ editNumber: num });
  }

  public async deleteNumber(num: string) {
    if (window.confirm("Удалить номер?")) {
      try {
        const numbers = await NumberService.DeleteNumber(num);
        this.setState({ numbers });
      } catch (ex) {
        this.setState({ error: ex.toString() });
      }
    }
  }

  public async saveNumber(num?: INumber) {
    try {
      if (num) {
        const numbers = await NumberService.SaveNumber(num);
        this.setState({ numbers });
      }
    } catch (ex) {
      this.setState({ error: ex.toString() });
    }
    // close editor
    this.setState({ editNumber: null });
  }

  public render() {
    return (
      <>
		<h1 className="d-flex justify-content-between">Номера<small>{this.state.numberInRange}</small></h1>
        {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
        {!this.state.numbers && <Spinner animation="grow" />}
        {this.state.numbers && (
          <>
            {this.state.editNumber !== null && (
              <EditNumber
                number={this.state.editNumber}
                onSave={this.saveNumber}
              />
            )}
            {this.state.editNumber === null && (
              <Button className="mv-3" onClick={this.addNumber}>
                Добавить номер
              </Button>
            )}
            <Row>
              <Col>
                <Table striped={true} hover={true} bordered={true}>
                  <thead>
                    <tr>
                      <th>Номер</th>
                      <th>Rfid</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.numbers.map(num => (
                      <tr key={num.id}>
                        <td>{num.id}</td>
                        <td>
                          {num.rfids.map(r => (
                            <div key={r}>{r}</div>
                          ))}
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            onClick={this.editNumber.bind(this, num)}
                          >
                            Править
                          </Button>
                          <Button
                            variant="outline-danger"
                            onClick={this.deleteNumber.bind(this, num.id)}
                          >
                            Удалить
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </>
        )}
      </>
    );
  }
}
