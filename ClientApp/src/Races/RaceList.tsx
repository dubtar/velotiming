import { RouteComponentProps } from "react-router";
import { Race } from "./Races";
import { Row, Table, Button, Alert, Spinner } from "react-bootstrap";
import React from 'react'


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

    loadRaces() {
        this.setState({ races: null });
        fetch('/api/races').then(r => r.json())
            .then(races => this.setState({ races }))
            .catch(error => this.setState({ error }))

    }

    async deleteRace(race: Race) {
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

    render() {
        if (this.state.races === null) return <div>Загрузка...</div>
        return (
            <Row>
                {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
                {this.state.races && (
                    <>
                        <h1>Гонки</h1>
                        <Table>
                            <thead><tr>
                                <th scope="col">Дата</th>
                                <th scope="col">Название</th>
                                <th scope="col">Описание</th>
                                <th></th>
                            </tr></thead>
                            {this.state.races.map(r => <tr key={r.id}>
                                <td>{new Date(r.date).toLocaleDateString('ru')}</td>
                                <td>{r.name}</td>
                                <td>{r.description}</td>
                                <td><Button variant="outline-danger" onClick={this.deleteRace.bind(this, r)}>Удалить</Button></td>
                            </tr>)}
                        </Table>
                    </>)}
                {this.state.races === null && <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>}
            </Row>
        )
    }
}