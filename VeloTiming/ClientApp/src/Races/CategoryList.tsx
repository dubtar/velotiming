import React from 'react'
import { Table, Button, ButtonGroup, Spinner, Alert } from 'react-bootstrap';
import EditCategory from './EditCategory';
import { RaceCategoryClient, RaceCategoryDto, Sex, IRaceCategoryDto } from '../clients';

const InitialState = {
    error: undefined as string | undefined,
    categories: null as IRaceCategoryDto[] | null,
    editCategory: null as IRaceCategoryDto | null
}

type Props = { raceId: number }

export default class CategoryList extends React.Component<Props, typeof InitialState> {

    constructor(props: Props) {
        super(props);
        this.state = InitialState;
        this.addCategory = this.addCategory.bind(this)
        this.saveCategory = this.saveCategory.bind(this)
    }

    public async componentDidMount() {
        try {
            const categories = await new RaceCategoryClient().get(this.props.raceId)
            this.setState({ categories, error: undefined })
        } catch (ex) {
            this.setState({ error: ex.toString() })
        }
    }


    public render() {
        return (
            <>
                {!this.state.categories && <Spinner animation="grow" />}
                {this.state.categories && (<Table hover striped bordered>
                    <thead><tr>
                        <th>Код</th>
                        <th>Название</th>
                        <th>Пол</th>
                        <th>Годы</th>
                        <th/>
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
                {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
            </>
        )
    }

    private addCategory() {
        this.setState({ editCategory: new RaceCategoryDto() })
    }

    private editCategory(category: IRaceCategoryDto) {
        this.setState({ editCategory: category });
    }

    private async deleteCategory(categoryId: number) {
        if (window.confirm('Удалить категорию?')) {
            try {
                const categories = await new RaceCategoryClient().delete(categoryId);
                this.setState({ categories, error: undefined })

            } catch (ex) {
                this.setState({ error: ex.toString() })
            }
        }
    }

    private async saveCategory(category?: IRaceCategoryDto): Promise<void> {
        try {
            if (category) {
                if (category.id) { // edit exiting
                    await new RaceCategoryClient().update(new RaceCategoryDto(category));

                } else { // add new
                    await new RaceCategoryClient().add(this.props.raceId, new RaceCategoryDto(category))
                }
                const categories = await new RaceCategoryClient().get(this.props.raceId)
                this.setState({ categories, error: undefined })
            }
        } catch (ex) {
            this.setState({ error: ex.toString() })
        }
        // close editor
        this.setState({ editCategory: null })
    }
}