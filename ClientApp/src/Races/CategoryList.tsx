import React from 'react'
import RaceService, { RaceCategory, Sex } from './RaceService';
import { Table, Button, ButtonGroup, Spinner } from 'react-bootstrap';
import EditCategory from './EditCategory';

const InitialState = {
    error: undefined as string | undefined,
    categories: null as RaceCategory[] | null,
    editCategory: null as RaceCategory | null
}

type Props = { raceId: number }

export default class CategoryList extends React.Component<Props, typeof InitialState> {

    constructor(props: Props) {
        super(props);
        this.state = InitialState;
        this.addCategory = this.addCategory.bind(this)
        this.saveCategory = this.saveCategory.bind(this)
    }

    async componentDidMount() {
        try {
            const categories = await RaceService.GetRaceCategories(this.props.raceId)
            this.setState({ categories })
        } catch (ex) {
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
        if (confirm('Удалить категорию?'))
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
                    await RaceService.AddCategory(this.props.raceId, category)
                }
                const categories = await RaceService.GetRaceCategories(this.props.raceId)
                this.setState({ categories })
            }
        } catch (ex) {
            this.setState({ error: ex.toString() })
        }
        // close editor
        this.setState({ editCategory: null })
    }

    render() {
        return (
            <>
                {!this.state.categories && <Spinner animation="grow" />}
                {this.state.categories && (<Table hover striped bordered>
                    <thead><tr>
                        <th>Код</th>
                        <th>Название</th>
                        <th>Пол</th>
                        <th>Годы</th>
                        <th></th>
                    </tr></thead>
                    <tbody>
                        {this.state.categories.map(cat => (
                            <tr key={cat.id}>
                                <td>{cat.code}</td>
                                <td>{cat.name}</td>
                                <td>{cat.sex && (cat.sex === Sex.Male ? 'Муж' : 'Жен')}</td>
                                <td>{(cat.minYearOfBirth || cat.maxYearOfBirth) &&
                                    `${cat.minYearOfBirth || ''} - ${cat.maxYearOfBirth || ''}`}</td>
                                <td>
                                    <ButtonGroup>
                                        <Button variant="outline-primary" onClick={this.editCategory.bind(this, cat)}>Изменить</Button>
                                        <Button variant="outline-danger" onClick={this.deleteCategory.bind(this, cat.id)}>Удалить</Button>
                                    </ButtonGroup>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>)}
                {this.state.editCategory !== null && <EditCategory category={this.state.editCategory} onSubmit={this.saveCategory} />}
                {this.state.editCategory === null && <Button onClick={this.addCategory}>Добавить категорию</Button>}
            </>
        )
    }
}