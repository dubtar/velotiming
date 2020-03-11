import React from "react";
import RaceService, { Start, RaceCategory } from "./RaceService";
import { Table, Row, Col, Alert, Spinner, Button, ButtonGroup } from "react-bootstrap";
import EditStart from "./EditStart";
import { Redirect } from "react-router";
import Svc from '../svc';
import moment from 'moment';

const InitialState = {
    starts: null as Start[] | null,
    categories: null as RaceCategory[] | null,
    editStart: null as Start | null,
    error: null as string | null,
    startRaceId: null as number | null
}

type Props = { raceId: number, raceDate: string }

export default class StartsList extends React.Component<Props, typeof InitialState> {

    constructor(props: Props) {
        super(props)
        this.state = InitialState
        this.addStart = this.addStart.bind(this)
        this.saveStart = this.saveStart.bind(this)
    }

    public async componentDidMount() {
        try {
            const starts = await RaceService.GetStarts(this.props.raceId)
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
                                <th>Название</th>
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
                                                    <Button variant="success" onClick={this.start.bind(this, start.id)}>Начать</Button>
                                                }
                                                <Button variant="outline-primary" onClick={this.editStart.bind(this, start)}>Изменить</Button>
                                                <Button variant="outline-danger" onClick={this.deleteStart.bind(this, start.id)}>Удалить</Button>
                                            </ButtonGroup>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {this.state.editStart !== null && this.state.categories &&
                            <EditStart start={this.state.editStart} categories={this.state.categories} onSubmit={this.saveStart} />}
                        {this.state.editStart === null && <Button className="mv-3" onClick={this.addStart}>Добавить заезд</Button>}
                    </>
                )}
            </Col></Row>
        )
    }

    private addStart() {
        RaceService.GetRaceCategories(this.props.raceId).then(categories => {
            this.setState({
                categories,
                editStart: { id: 0, name: '', plannedStart: null, realStart: null, end: null, categories: [] }
            })
        }, error => { this.setState({ error }) });
    }

    private editStart(editStart: Start) {
        RaceService.GetRaceCategories(this.props.raceId).then(categories => {
            this.setState({
                categories, editStart
            })
        }, error => { this.setState({ error }) });
    }

    private async deleteStart(startId: number) {
        if (confirm('Удалить участника?')) {
            try {
                const starts = await RaceService.DeleteStart(startId);
                this.setState({ starts })

            } catch (ex) {
                this.setState({ error: ex.toString() })
            }
        }
    }

    private async start(startId: number) {
        try {
            await Svc.SetActiveStart(startId)
            this.setState({ startRaceId: startId });
        }
        catch (ex) {
            this.setState({ error: ex.toString() })
        }
    }

    private async saveStart(start?: Start) {
        try {
            if (start) {
                let starts;
                if (start.id) {// edit exiting
                    starts = await RaceService.UpdateStart(start);
                } else {
                    // add new
                    let plannedStart: string | null = null;
                    if (start.plannedStart) {
                        const nums = start.plannedStart.split(':');
                        if (nums.length === 2) {
                            const hours = parseInt(nums[0], 10);
                            const minutes = parseInt(nums[1], 10);
                            plannedStart = moment(this.props.raceDate).hours(hours).minutes(minutes).seconds(0).toJSON();
                        }
                    }
                    starts = await RaceService.AddStart(this.props.raceId, {...start, plannedStart })
                }
                this.setState({ starts })
            }
        } catch (ex) {
            this.setState({ error: ex.toString() })
        }
        // close editor
        this.setState({ editStart: null })
    }

}