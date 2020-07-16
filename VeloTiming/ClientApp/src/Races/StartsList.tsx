import React from "react";
import { Table, Row, Col, Alert, Spinner, Button, ButtonGroup } from "react-bootstrap";
import EditStart from "./EditStart";
import { Redirect } from "react-router";
import { MainClient, StartClient, StartDto, RaceCategoryDto, RaceCategoryClient } from '../clients'
import { Link } from "react-router-dom";

const InitialState = {
    starts: null as StartDto[] | null,
    categories: null as RaceCategoryDto[] | null,
    editStart: null as StartDto | null,
    error: null as string | null,
    startRaceId: null as number | null
}

type Props = { raceId: number, raceDate: Date }

export default class StartsList extends React.Component<Props, typeof InitialState> {

    constructor(props: Props) {
        super(props)
        this.state = InitialState
        this.addStart = this.addStart.bind(this)
        this.saveStart = this.saveStart.bind(this)
    }

    public async componentDidMount() {
        try {
            const starts = await new StartClient().get(this.props.raceId)
            this.setState({ starts })
        } catch (ex) {
            this.setState({ error: ex.toString() })
        }
    }

    public render() {
        if (this.state.startRaceId) return <Redirect to="/run" />
        return (
            <Row><Col>
                {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
                {!this.state.starts && <Spinner animation="grow" />}
                {this.state.starts && (
                    <>
                        <Table striped hover bordered>
                            <thead><tr>
                                <th>Заезд</th>
                                <th>Старт</th>
                                <th>Категории</th>
                                <th />
                            </tr></thead>
                            <tbody>
                                {this.state.starts.map(start => (
                                    <tr key={start.id}>
                                        <td>{start.name}</td>
                                        <td>{start.plannedStart && new Date(start.plannedStart).toLocaleTimeString('ru')}</td>
                                        <td>{start.categories && start.categories.map(c => c.name).join(', ')}</td>
                                        <td>
                                            <ButtonGroup>
                                                {start.realStart == null &&
                                                    <Button variant="success" onClick={this.start.bind(this, start.id!)}>Начать</Button>
                                                    ||
                                                    <Link className="btn btn-outline-success" to={`results/${start.id}`}>Результаты</Link>}
                                                <Button variant="outline-primary" onClick={this.editStart.bind(this, start)}>Изменить</Button>
                                                <Button variant="outline-danger" onClick={this.deleteStart.bind(this, start.id!)}>Удалить</Button>
                                            </ButtonGroup>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {this.state.editStart !== null && this.state.categories &&
                            <EditStart start={this.state.editStart} categories={this.state.categories} onSubmit={this.saveStart} />}
                        {this.state.editStart === null && <Button className="mv-3 float-right" onClick={this.addStart}>Добавить заезд</Button>}
                    </>
                )}
            </Col></Row>
        )
    }

    private addStart() {
        new RaceCategoryClient().get(this.props.raceId).then(categories => {
            const newState = {
                categories,
                editStart: new StartDto()
            };
            newState.editStart.delayMarksAfterStartMinutes = 1
            this.setState(newState)
        }, error => { this.setState({ error }) });
    }

    private editStart(editStart: StartDto) {
        new RaceCategoryClient().get(this.props.raceId).then(categories => {
            this.setState({
                categories, editStart
            })
        }, error => { this.setState({ error }) });
    }

    private async deleteStart(startId: number) {
        if (window.confirm('Удалить участника?')) {
            try {
                const starts = await new StartClient().delete(startId);
                this.setState({ starts })

            } catch (ex) {
                this.setState({ error: ex.toString() })
            }
        }
    }

    private async start(startId: number) {
        try {
            await new MainClient().setActiveStart(startId)
            this.setState({ startRaceId: startId });
        }
        catch (ex) {
            this.setState({ error: ex.toString() })
        }
    }

    private async saveStart(start?: StartDto) {
        try {
            if (start) {
                let starts;
                if (start.id) {// edit exiting
                    starts = await new StartClient().update(start);
                } else {
                    // add new
                    starts = await new StartClient().add(this.props.raceId, start);
                }
                this.setState({ starts })
            }
        } catch (ex) {
            this.setState({ error: ex.toString() })
        }
        finally {
            // close editor
            this.setState({ editStart: null })
        }
    }

}