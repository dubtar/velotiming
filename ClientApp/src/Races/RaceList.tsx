import { RouteComponentProps, Redirect } from "react-router";
import { Race } from "./RaceSvc";
import { Row, Table, Button, Alert, Spinner, ButtonGroup } from "react-bootstrap";
import React, { SyntheticEvent } from 'react'


const InitialState = {
    error: null as string | null,
    races: null as Race[] | null,
    gotoRace: 0
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

    loadRaces() {
        this.setState({ races: null });
        fetch('/api/races').then(r => r.json())
            .then(races => this.setState({ races }))
            .catch(error => this.setState({ error }))

    }

    async deleteRace(race: Race, e: SyntheticEvent) {
        e.stopPropagation()
        e.preventDefault()
        if (confirm(`Удалить гонку ${race.name}?`)) {

            try {
                const resp = await fetch(`/api/races/${race.id}`, {
                    method: 'delete'
                });
                if (resp.ok)
                    this.loadRaces();
                else
                    throw `${resp.statusText}: ${resp.body}`;
            } catch (ex) {
                this.setState({ error: ex.toString() })
            }
        }
    }

    openRace(id: number, e: SyntheticEvent) {
        e.stopPropagation()
        e.preventDefault()
        this.setState({ gotoRace: id })
    }

    render() {
        if (this.state.gotoRace > 0) return <Redirect push to={`${this.props.match.path}/${this.state.gotoRace}`} />;
        return (
            <Row>
                {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
                {this.state.races && (
                    <>
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
                                        <td>
                                            <ButtonGroup>
                                                <Button variant="outline-primary" onClick={this.openRace.bind(this, r.id)}>Перейти</Button>
                                                <Button variant="outline-danger" onClick={this.deleteRace.bind(this, r)}>Удалить</Button>
                                            </ButtonGroup>
                                        </td>
                                    </tr>))}
                            </tbody>
                        </Table>
                    </>)}

                {this.state.races === null && <Spinner animation="border" className="m-3"></Spinner>}
            </Row>
        )
    }
}