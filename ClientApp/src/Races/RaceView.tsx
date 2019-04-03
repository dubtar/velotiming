import { RouteComponentProps } from "react-router";
import React from 'react'
import { Spinner, Alert, Row, Col, Button } from "react-bootstrap";
import RaceSvc, { Race, Category } from "./RaceSvc";
import EditCategory from "./EditCategory";
import RaceService from "./RaceSvc";

const InitialState = {
    raceId: 0,
    race: undefined as Race | undefined,
    error: '',
    editCategory: null as Category | null
}

type Props = RouteComponentProps<{ id: string }>

export default class RaceView extends React.Component<Props, typeof InitialState> {
    constructor(props: Props) {
        super(props)
        this.state = { ...InitialState, raceId: parseInt(props.match.params.id) }
        this.addCategory = this.addCategory.bind(this);
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

    addCategory() {
        this.setState({ editCategory: { id: 0, name: '', code: '' } })
    }

    async saveCategory(category?: Category) {
        if (category) {
            if (category.id) { // edit exiting
                // TODO

            } else { // add new
                await RaceSvc.AddCategory(this.state.race!!.id, category)
            }
        }
        else
            this.setState({ editCategory: null })
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
                {this.state.editCategory !== null && <EditCategory category={this.state.editCategory} onSubmit={this.saveCategory} />}
                {this.state.editCategory === null && <Button onClick={this.addCategory}>Добавить категорию</Button>}
            </Col> </Row>
        )
    }
}