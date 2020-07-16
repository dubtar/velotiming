import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { StartClient, MarkDto, RaceDto, StartDto } from "../clients";
import { Row, Col, Alert, Spinner, Table } from "react-bootstrap";
import Svc from "../svc"


const InitialState = {
    race: undefined as RaceDto | undefined,
    start: undefined as StartDto | undefined,
    results: undefined as MarkDto[] | undefined,
    error: null as string | null,
}

type Props = RouteComponentProps<{ id: string }>

export default class StartsList extends React.Component<Props, typeof InitialState> {

    constructor(props: Props) {
        super(props)
        this.state = InitialState
    }

    public componentDidMount() {
        new StartClient().getResults(parseInt(this.props.match.params.id, 10))
            .then(r =>
                this.setState({ race: r.race, start: r.start, results: r.results }))
            .catch(ex =>
                this.setState({ error: ex.toString() })
            );
    }

    public render() {
        return (
            <Row><Col>
                {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
                {!this.state.start && <Spinner animation="grow" />}
                {this.state.race &&
                    <h1>{this.state.race.name} <small>{this.state.race.date?.toLocaleDateString('ru')}</small></h1>
                }
                {this.state.start &&
                    <h2>{this.state.start.name} <small>{this.state.start.realStart?.toLocaleTimeString('ru')}</small></h2>
                }
                {this.state.start &&
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>Круг</th>
                                <th>Место</th>
                                <th>Время</th>
                                <th>Номер</th>
                                <th>Гонщик</th>
                                <th>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.results && this.state.results.map(mark => (
                                <tr key={mark.id}>
                                    <td>{mark.lap}</td>
                                    <td>{mark.place}</td>
                                    <td>{Svc.formatTime(mark.time, this.state.start?.realStart)}</td>
                                    <td>{mark.number}</td>
                                    <td>{mark.name}</td>
                                    <td><small>{(mark.time || mark.createdOn)?.toLocaleTimeString('ru')}</small></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                }

            </Col></Row>
        );
    }
}