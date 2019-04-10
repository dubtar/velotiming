import React from 'react'
import { Rider, Sex, RaceCategory } from './RaceService'
import { string as yupString, number as yupNumber, ref as yupRef, object as yupObject } from 'yup'
import { Formik } from 'formik';
import { Form, Col, Button } from 'react-bootstrap'
import Feedback from 'react-bootstrap/Feedback';

interface Props {
    rider: Rider
    categories: RaceCategory[]
    onSubmit: (rider?: Rider) => void
}

const schema = yupObject({
    firstName: yupString().required('Фамилия обязательна'),
    lastName: yupString().required('Имя обязательно'),
    sex: yupString().required('Пол обязателен'),
    yearOfBirth: yupNumber().nullable().lessThan(new Date().getFullYear(), 'Не похож на г.р.').moreThan(1900, 'Не похож на г.р.')
})

const onChange = (e: React.ChangeEvent<HTMLInputElement>,
    values: Rider,
    handleChange: (e: React.ChangeEvent) => void,
    setFieldValue: () => void) => {

}

const EditRider: React.SFC<Props> = (props) => {
    return (
        <Formik validationSchema={schema} onSubmit={props.onSubmit} initialValues={props.rider} onReset={() => props.onSubmit(undefined)}>
            {({ handleSubmit, handleChange, handleReset, values, touched, errors, setFieldValue }) => (
                <Form noValidate onSubmit={handleSubmit} onReset={handleReset} className="bg-light p-3">
                    <Form.Row>
                        <Form.Group as={Col} controlId="lastName" className="col-2">
                            <Form.Label>Фамилия</Form.Label>
                            <Form.Control type="text" value={values.lastName} name="lastName" maxLength={50}
                                onChange={handleChange} isInvalid={touched.lastName && !!errors.lastName} />
                            <Feedback type="invalid">{errors.lastName}</Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="name" className="col-2">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control type="text" value={values.firstName} name="firstName" maxLength={50}
                                onChange={handleChange} isInvalid={touched.firstName && !!errors.firstName} />
                            <Feedback type="invalid">{errors.firstName}</Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="sex">
                            <Form.Label>Пол</Form.Label>
                            <Form.Row>
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
                                    isInvalid={!!errors.sex}
                                    id="sexMale" />
                            </Form.Row>
                            <Feedback type="invalid">{errors.sex}</Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="yearOfBirth">
                            <Form.Label>Г.р.</Form.Label>
                            <Form.Control type="number" value={values.yearOfBirth && values.yearOfBirth.toString() || ''}
                                name="yearOfBirth" onChange={onChangeAndSetDefaultCategory(handleChange, values, props, setFieldValue)}
                                isInvalid={touched.yearOfBirth && !!errors.yearOfBirth} />
                            <Feedback type="invalid">{errors.yearOfBirth}</Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="category">
                            <Form.Label>Категория</Form.Label>
                            <Form.Control as="select" name="category" onChange={handleChange}
                                isInvalid={touched.category && !!errors.category} value={values.category}>
                                <option></option>
                                {props.categories.map(cat => (
                                    <option key={cat.id} value={cat.code}>{cat.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Button variant="primary" type="submit">{`${values.id ? 'Сохранить' : 'Добавить'} участника`}</Button>
                        <Button variant="secondary" type="reset" className="ml-3">Отмена</Button>
                    </Form.Row>
                </Form>
            )}
        </Formik>
    )
}

export default EditRider

function onChangeAndSetDefaultCategory(handleChange: (e: React.ChangeEvent<EventTarget>) => void, values: Rider,
    props: Props, setFieldValue: (field: string, value: any) => void) {
    return (e: React.ChangeEvent<EventTarget>) => {
        handleChange(e);
        const yearText = (e.target as HTMLInputElement).value;
        const year = yearText && parseInt(yearText) || 0;
        const sex = values.sex;
        if (sex && year > 1900 && year < new Date().getFullYear() && !values.category) {
            const category = props.categories.find(cat => cat.sex === sex &&
                (!cat.minYearOfBirth || cat.minYearOfBirth <= year) &&
                (!cat.maxYearOfBirth || cat.maxYearOfBirth >= year));
            if (category)
                setFieldValue('category', category.code);
        }
    };
}
