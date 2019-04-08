import { RouteComponentProps } from "react-router";
import React from 'react'
import { Spinner, Alert, Row, Col, Button, Tab, Tabs } from "react-bootstrap";
import RaceService, { Race, RaceCategory } from "./RaceService";
import EditCategory from "./EditCategory";
import CategoryList from "./CategoryList";

const InitialState = {
    raceId: 0,
    race: undefined as Race | undefined,
    error: ''
}

type Props = RouteComponentProps<{ id: string }>

export default class RaceView extends React.Component<Props, typeof InitialState> {
    constructor(props: Props) {
        super(props)
        this.state = { ...InitialState, raceId: parseInt(props.match.params.id) }
    }

    async componentDidMount() {
        try {
            const race = await RaceService.GetRace(this.state.raceId)
            this.setState({ race: race })
        }
        catch (ex) {
            this.setState({ error: ex.toString() })
        }
    }

    render() {
        if (this.state.error) return <Alert variant="danger">{this.state.error}</Alert>
        if (!this.state.race) return <Spinner animation="grow"></Spinner>
        return (
            <Row><Col>
                <h1>{this.state.race.name} <small>{new Date(this.state.race.date).toLocaleDateString('ru')}</small></h1>
                <p className="lead">{this.state.race.description}</p>
                <Tabs id="raceTabs">
                    <Tab eventKey="categories" title="Категории">
                        <CategoryList raceId={this.state.raceId} />
                    </Tab>
                    <Tab eventKey="riders" title="Участники">
                        Участники
                    </Tab>
                </Tabs>
            </Col> </Row>
        )
    }
}