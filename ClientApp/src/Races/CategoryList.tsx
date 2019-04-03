import React from 'react'
import { RaceCategory, Sex } from './RaceService';
import { Table, Button, ButtonGroup } from 'react-bootstrap';

type Props = {
    categories: RaceCategory[],
    onDelete: (categoryId: number) => void,
    onEdit: (category: RaceCategory) => void
}

const CategoryList: React.SFC<Props> = (props) => {

    return (
        <Table hover striped bordered>
            <thead>
                <th>Код</th>
                <th>Название</th>
                <th>Пол</th>
                <th>Годы</th>
                <th></th>
            </thead>
            <tbody>
                {props.categories.map(cat => (
                    <tr key={cat.id}>
                        <td>{cat.code}</td>
                        <td>{cat.name}</td>
                        <td>{cat.sex && (cat.sex === Sex.Male ? 'Муж' : 'Жен')}</td>
                        <td>{(cat.minYearOfBirth || cat.maxYearOfBirth) && `${cat.minYearOfBirth} - ${cat.maxYearOfBirth}`}</td>
                        <td>
                            <ButtonGroup>
                                <Button variant="outline-primary" onClick={props.onEdit.bind(null, cat)}>Изменить</Button>
                                <Button variant="outline-danger" onClick={props.onDelete.bind(null, cat.id)}>Удалить</Button>
                            </ButtonGroup>
                        </td>

                    </tr>
                ))}
            </tbody>
        </Table>
    )
}
export default CategoryList