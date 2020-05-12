import React from 'react'
import { Formik } from 'formik';
import { string as yupString, number as yupNumber, ref as yupRef, object as yupObject } from 'yup'
import { Form, Col, Button } from 'react-bootstrap';
import Feedback from 'react-bootstrap/Feedback';
import { IRaceCategoryDto, Sex } from '../clients';

interface Props {
    category: IRaceCategoryDto;
    onSubmit: (category?: IRaceCategoryDto) => void;
}

const schema = yupObject({
    code: yupString().required('Код обязателен').max(3, 'Максимум 3 символа'),
    name: yupString().required('Название обязательно'),
    sex: yupString().required('Пол обязателен'),
    minYearOfBirth: yupNumber().nullable()
        .when('maxYearOfBirth', {
            is: (m) => !!m,
            then: yupNumber().lessThan(yupRef('maxYearOfBirth'), "Мин. должен быть меньше макс.")
        }),
    maxYearOfBirth: yupNumber().nullable()
})

const EditCategory: React.SFC<Props> = (props: Props) => {
    const onReset = () => props.onSubmit(undefined)
    return (
        <Formik validationSchema={schema} onSubmit={props.onSubmit} initialValues={props.category} onReset={onReset}>
            {({ handleSubmit, handleChange, handleReset, values, touched, errors }) => (
                <Form noValidate onSubmit={handleSubmit} onReset={handleReset} className="bg-light p-3">
                    <h3>{values.id ? 'Правка категории' : 'Новая категория'}</h3>
                    <Form.Row>
                        <Form.Group as={Col} controlId="code" className="col-2">
                            <Form.Label>Код</Form.Label>
                            <Form.Control type="text" value={values.code || ''} name="code" maxLength={3}
                                onChange={handleChange} isInvalid={touched.code && !!errors.code} autoFocus />
                            <Feedback type="invalid">{errors.code}</Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="name" className="col-4">
                            <Form.Label>Название</Form.Label>
                            <Form.Control type="text" value={values.name || ''} name="name" maxLength={50}
                                onChange={handleChange} isInvalid={touched.name && !!errors.name} />
                            <Feedback type="invalid">{errors.name}</Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="sex" className="mh-3 col-2">
                            <Form.Label>Пол</Form.Label>
                            <Form.Row className="pt-2 pl-6">
                                <Form.Check type="radio" inline
                                    checked={values.sex === Sex.Male}
                                    value={Sex.Male}
                                    name="sex"
                                    label="Муж"
                                    onChange={handleChange}
                                    isInvalid={!!errors.sex}
                                    id="sexMale" />
                                <Form.Check type="radio" inline
                                    checked={values.sex === Sex.Female}
                                    value={Sex.Female}
                                    name="sex"
                                    label="Жен"
                                    onChange={handleChange}
                                    isInvalid={touched.sex && !!errors.sex}
                                    id="sexMale" />
                            </Form.Row>
                            <Feedback type="invalid">{errors.sex}</Feedback>
                        </Form.Group>
                        <Form.Group as={Col} className="col-2">
                            <Form.Label>Г.р. мин</Form.Label>
                            <Form.Control type="number" value={values.minYearOfBirth?.toString() || ''}
                                name="minYearOfBirth" min={1900} max={new Date().getFullYear()}
                                onChange={handleChange} isInvalid={touched.minYearOfBirth && !!errors.minYearOfBirth} />
                            <Feedback type="invalid">{errors.minYearOfBirth}</Feedback>
                        </Form.Group>
                        <Form.Group as={Col} className="col-2">
                            <Form.Label>Г.р. макс</Form.Label>
                            <Form.Control type="number" value={values.maxYearOfBirth?.toString() || ''}
                                name="maxYearOfBirth" min={1900} max={new Date().getFullYear()}
                                onChange={handleChange} isInvalid={touched.maxYearOfBirth && !!errors.maxYearOfBirth} />
                            <Feedback type="invalid">{errors.maxYearOfBirth}</Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Button variant="primary" type="submit">Добавить категорию</Button>
                        <Button variant="secondary" type="reset" className="ml-3">Отмена</Button>
                    </Form.Row>
                </Form>
            )}
        </Formik>)
}

export default EditCategory