import { RouteComponentProps, Redirect } from "react-router";
import RaceService, { Race } from "./RaceService";
import { Row, Table, Button, Alert, Spinner, ButtonGroup } from "react-bootstrap";
import React, { SyntheticEvent } from 'react'
import { Link } from "react-router-dom";


const InitialState = {
    error: null as string | null,
    races: null as Race[] | null
}

type Props = RouteComponentProps<{}>

export default class RaceList extends React.Component<Props, typeof InitialState> {

    constructor(props: Props) {
        super(props);
        this.state = InitialState;
        this.loadRaces = this.loadRaces.bind(this);
    }

    componentDidMount() {
        this.loadRaces();
    }

    async loadRaces() {
        this.setState({ races: null });
        try {

            const races = await RaceService.GetRaces();
            this.setState({ races })
        } catch (ex) {
            this.setState({ error: ex.toString() })
        }
    }

    async deleteRace(race: Race, e: SyntheticEvent) {
        e.stopPropagation()
        e.preventDefault()
        if (confirm(`Удалить гонку ${race.name}?`)) {

            try {
                await RaceService.DeleteRace(race.id)
                this.loadRaces();
            } catch (ex) {
                this.setState({ error: ex.toString() })
            }
        }
    }

    openRace(id: number, e: SyntheticEvent) {
        e.stopPropagation()
        e.preventDefault()
        this.props.history.push(`${this.props.match.path}/${id}`)
        // this.setState({ gotoRace: id })
    }

    render() {
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
                                <th></th>
                            </tr></thead>
                            <tbody>
                                {this.state.races.map(r => (
                                    <tr key={r.id} onClick={this.openRace.bind(this, r.id)} >
                                        <td>{new Date(r.date).toLocaleDateString('ru')}</td>
                                        <td>{r.name}</td>
                                        <td>{r.description}</td>
                                        <td onClick={(e) => { e.stopPropagation() }}>
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

                {this.state.races === null && <Spinner animation="border" className="m-3"></Spinner>}
            </Row>
        )
    }
}