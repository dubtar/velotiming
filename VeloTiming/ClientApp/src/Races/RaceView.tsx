import { RouteComponentProps } from "react-router";
import React from 'react'
import { Spinner, Alert, Row, Col, Tab, Tabs } from "react-bootstrap";
import CategoryList from "./CategoryList"
import RidersList from "./RidersList"
import StartsList from './StartsList'
import { RacesClient, RaceDto } from "../clients";

const InitialState = {
    raceId: 0,
    race: undefined as RaceDto | undefined,
    error: ''
}

type Props = RouteComponentProps<{ id: string }>

export default class RaceView extends React.Component<Props, typeof InitialState> {
    constructor(props: Props) {
        super(props)
        this.state = { ...InitialState, raceId: parseInt(props.match.params.id, 10) }
    }

    public async componentDidMount() {
        try {
            const race = await new RacesClient().get(this.state.raceId)
            this.setState({ race })
        }
        catch (ex) {
            this.setState({ error: ex.toString() })
        }
    }

    public render() {
        if (this.state.error) return <Alert variant="danger">{this.state.error}</Alert>
        if (!this.state.race) return <Spinner animation="grow"/>
        return (
            <Row><Col>
                <h1>{this.state.race.name} <small>{this.state.race.date && this.state.race.date?.toLocaleDateString('ru')}</small></h1>
                <p className="lead">{this.state.race.description}</p>
                <Tabs id="raceTabs">
                    <Tab eventKey="categories" title="Категории">
                        <CategoryList raceId={this.state.raceId} />
                    </Tab>
                    <Tab eventKey="riders" title="Участники">
                        <RidersList raceId={this.state.raceId} />
                    </Tab>
                    <Tab eventKey="starts" title="Заезды">
                        <StartsList raceId={this.state.raceId} raceDate={this.state.race.date} />
                    </Tab>
                </Tabs>
            </Col></Row>
        )
    }
}