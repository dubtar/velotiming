import { RouteComponentProps } from "react-router";
import { Race } from "./Races";
import { Row, Table } from "react-bootstrap";
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
    }

    componentDidMount() {
        fetch('/api/races').then(r => r.json())
            .then(races => this.setState({ races }))
            .catch(error => this.setState({ error }))
    }

    render() {
        if (this.state.error !== null)
            return (<div className="alert alert-danger">{this.state.error}</div>)

        if (this.state.races === null) return <div>Загрузка...</div>
        return (
            <Row>
                {this.state.races.length > 0 && <Table>
                    <thead><tr>
                        <th scope="col">Дата</th>
                        <th scope="col">Название</th>
                        <th scope="col">Описание</th>
                    </tr></thead>
                    {this.state.races.map(r => <tr key={r.Id}>
                        <td>{r.Date.toLocaleDateString('ru')}</td>
                        <td>{r.Name}</td>
                        <td>{r.Description}</td>
                    </tr>)}
                </Table>
                }
            </Row>
        )
    }
}