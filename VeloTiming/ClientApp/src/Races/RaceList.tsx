import { RouteComponentProps } from "react-router";
import { Row, Table, Button, Alert, Spinner, ButtonGroup } from "react-bootstrap";
import React, { SyntheticEvent } from 'react'
import { Link } from "react-router-dom";
import { RaceDto, RacesClient } from "../clients";


const InitialState = {
    error: null as string | null,
    races: null as RaceDto[] | null
}

type Props = RouteComponentProps<{}>

export default class RaceList extends React.Component<Props, typeof InitialState> {

    constructor(props: Props) {
        super(props);
        this.state = InitialState;
    }

    public componentDidMount() {
        this.loadRaces();
    }

    public render() {
        return (
            <Row>
                {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
                {this.state.races && (
                    <Row>
                        <h1>Гонки</h1>
                        <Table striped bordered hover>
                            <thead><tr>
                                <th scope="col">Дата</th>
                                <th scope="col">Название</th>
                                <th scope="col">Описание</th>
                                <th />
                            </tr></thead>
                            <tbody>
                                {this.state.races.map(r => (
                                    <tr key={r.id} onClick={this.openRace.bind(this, r.id)} >
                                        <td>{new Date(r.date).toLocaleDateString('ru')}</td>
                                        <td>{r.name}</td>
                                        <td>{r.description}</td>
                                        <td onClick={this.stopPropagation}>
                                            <ButtonGroup>
                                                <Link className="btn btn-outline-primary" to={`${this.props.match.path}/${r.id}`}>Перейти</Link>
                                                <Link to={`${this.props.match.path}/add/${r.id}`} className="btn btn-outline-warning">Изменить</Link>
                                                <Button variant="outline-danger" onClick={this.deleteRace.bind(this, r)}>Удалить</Button>
                                            </ButtonGroup>
                                        </td>
                                    </tr>))}
                            </tbody>
                        </Table>
                        <Link to={`${this.props.match.path}/add`} className="btn btn-primary">
                            Добавить гонку
                        </Link>
                    </Row>)}

                {this.state.races === null && <Spinner animation="border" className="m-3" />}
            </Row>
        )
    }

    private async loadRaces() {
        this.setState({ races: null });
        try {

            const races = await new RacesClient().getRaces();
            this.setState({ races })
        } catch (ex) {
            this.setState({ error: ex.toString() })
        }
    }

    private  async deleteRace(race: RaceDto, e: SyntheticEvent) {
        e.stopPropagation()
        e.preventDefault()
        if (window.confirm(`Удалить гонку ${race.name}?`)) {

            try {
                await new RacesClient().deleteRace(race.id)
                this.loadRaces();
            } catch (ex) {
                this.setState({ error: ex.toString() })
            }
        }
    }

    private openRace(id: number, e: SyntheticEvent) {
        e.stopPropagation()
        e.preventDefault()
        this.props.history.push(`${this.props.match.path}/${id}`)
        // this.setState({ gotoRace: id })
    }

    private stopPropagation(e: React.SyntheticEvent) { e.stopPropagation() }
}