import React from "react";
import RaceService, { Start, Sex, RaceCategory } from "./RaceService";
import { Table, Row, Col, Alert, Spinner, Button, ButtonGroup } from "react-bootstrap";
import EditStart from "./EditStart";

const InitialState = {
    starts: null as Start[] | null,
    categories: null as RaceCategory[] | null,
    editStart: null as Start | null,
    error: null as string | null
}

type Props = { raceId: number }

export default class StartsList extends React.Component<Props, typeof InitialState> {

    constructor(props: Props) {
        super(props)
        this.state = InitialState
        this.addStart = this.addStart.bind(this)
        this.saveStart = this.saveStart.bind(this)
    }

    async componentDidMount() {
        RaceService.GetRaceCategories(this.props.raceId).then(categories => {
            this.setState({ categories })
        }, error => { this.setState({ error }) });
        try {
            const starts = await RaceService.GetStarts(this.props.raceId)
            this.setState({ starts })
        } catch (ex) {
            this.setState({ error: ex.toString() })
        }
    }

    addStart() {
        this.setState({ editStart: { id: 0, name: '', plannedStart: null, realStart: null, end: null, categories: [] } })
    }

    editStart(editStart: Start) {
        this.setState({ editStart })
    }

    async deleteStart(startId: number) {
        if (confirm('Удалить участника?'))
            try {
                const starts = await RaceService.DeleteStart(startId);
                this.setState({ starts })

            } catch (ex) {
                this.setState({ error: ex.toString() })
            }
    }

    async saveStart(start?: Start) {
        try {
            if (start) {
                const starts = start.id ?  // edit exiting
                    await RaceService.UpdateStart(start) :
                    // add new
                    await RaceService.AddStart(this.props.raceId, start)
                this.setState({ starts })
            }
        } catch (ex) {
            this.setState({ error: ex.toString() })
        }
        // close editor
        this.setState({ editStart: null })
    }

    render() {
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
                                <th></th>
                            </tr></thead>
                            <tbody>
                                {this.state.starts.map(start => (
                                    <tr key={start.id}>
                                        <td>{start.name}</td>
                                        <td>{start.plannedStart && new Date(start.plannedStart).toLocaleTimeString('ru')}</td>
                                        <td>{start.categories && start.categories.map(c => c.name + ' ')}</td>
                                        <td>
                                            <ButtonGroup>
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

}