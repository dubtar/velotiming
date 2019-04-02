import { RouteComponentProps } from "react-router";
import React from 'react'
import { Spinner, Alert, Row, Col, Button } from "react-bootstrap";
import { Race, Category } from "./RaceSvc";
import EditCategory from "../EditCategory";

const InitialState = {
    raceId: '',
    race: undefined as Race | undefined,
    error: '',
    editCategory: undefined as Category | undefined
}

type Props = RouteComponentProps<{ id: string }>

export default class RaceView extends React.Component<Props, typeof InitialState> {
    constructor(props: Props) {
        super(props)
        this.state = { ...InitialState, raceId: props.match.params.id }
        this.addCategory = this.addCategory.bind(this);
    }

    async componentDidMount() {
        try {
            const resp = await fetch(`/api/races/${this.state.raceId}`)
            if (!resp.ok) throw `${resp.statusText} ${resp.body}`
            this.setState({ race: await resp.json() })
        }
        catch (ex) {
            this.setState({ error: ex.toString() })
        }
    }

    addCategory() {
        this.setState({ editCategory: { id: 0, name: '', shortName: '', minYearOrBirth: 0, maxYearOrBirth: new Date().getFullYear() } })
    }

    render() {
        if (this.state.error) return <Alert variant="danger">{this.state.error}</Alert>
        if (!this.state.race) return <Spinner animation="grow"></Spinner>
        return (
            <Row><Col>
                <h1>{this.state.race.name} <small>{new Date(this.state.race.date).toLocaleDateString('ru')}</small></h1>
                <p className="lead">{this.state.race.description}</p>
                <hr />
                <h3>Категории</h3>
                {this.state.editCategory && <EditCategory category={this.state.editCategory}/>}
                <Button onClick={this.addCategory}>Добавить категорию</Button>
            </Col> </Row>
        )
    }
}