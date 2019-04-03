import { RouteComponentProps } from "react-router";
import React from 'react'
import { Spinner, Alert, Row, Col, Button } from "react-bootstrap";
import RaceService, { Race, RaceCategory } from "./RaceService";
import EditCategory from "./EditCategory";
import CategoryList from "./CategoryList";

const InitialState = {
    raceId: 0,
    race: undefined as Race | undefined,
    error: '',
    loadingCategories: true,
    categories: null as RaceCategory[] | null,
    editCategory: null as RaceCategory | null
}

type Props = RouteComponentProps<{ id: string }>

export default class RaceView extends React.Component<Props, typeof InitialState> {
    constructor(props: Props) {
        super(props)
        this.state = { ...InitialState, raceId: parseInt(props.match.params.id) }
        this.addCategory = this.addCategory.bind(this)
        this.editCategory = this.editCategory.bind(this)
        this.deleteCategory = this.deleteCategory.bind(this)
        this.saveCategory = this.saveCategory.bind(this)
    }

    async componentDidMount() {
        try {
            const race = await RaceService.GetRace(this.state.raceId)
            this.setState({ race: race })
            const categories = await RaceService.GetRaceCategories(this.state.raceId)
            this.setState({ categories })
        }
        catch (ex) {
            this.setState({ error: ex.toString() })
        }
    }

    addCategory() {
        this.setState({ editCategory: { id: 0, name: '', code: '' } })
    }

    editCategory(category: RaceCategory) {
        this.setState({ editCategory: category });
    }

    async deleteCategory(categoryId: number) {
        try {
            const categories = await RaceService.DeleteCategory(categoryId);
            this.setState({ categories })

        } catch (ex) {
            this.setState({ error: ex.toString() })
        }
    }

    async saveCategory(category?: RaceCategory) {
        try {
            if (category) {
                if (category.id) { // edit exiting
                    await RaceService.UpdateCategory(category);

                } else { // add new
                    await RaceService.AddCategory(this.state.race!!.id, category)
                }
                const categories = await RaceService.GetRaceCategories(this.state.raceId)
                this.setState({ categories })
            }
        } catch (ex) {
            this.setState({ error: ex.toString() })
        }
        // close editor
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
                {this.state.categories && <CategoryList categories={this.state.categories}
                    onDelete={this.deleteCategory} onEdit={this.editCategory} />}
                {this.state.editCategory !== null && <EditCategory category={this.state.editCategory} onSubmit={this.saveCategory} />}
                {this.state.editCategory === null && <Button onClick={this.addCategory}>Добавить категорию</Button>}
            </Col> </Row>
        )
    }
}