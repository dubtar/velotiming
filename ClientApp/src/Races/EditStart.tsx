import React from 'react'
import { Start, Sex, RaceCategory } from './RaceService'
import { object as yupObject, string as yupString, date as yupDate } from 'yup'
import { Formik } from 'formik';
import { Form, Col, Button } from 'react-bootstrap'
import Feedback from 'react-bootstrap/Feedback';

interface Props {
    start: Start
    categories: RaceCategory[]
    onSubmit: (start?: Start) => void
}

const schema = yupObject({
    name: yupString().required('Как-нибудь хоть назови'),
    plannedStart: yupString().nullable()
})

const EditStart: React.SFC<Props> = (props) => {
    return (
        <Formik validationSchema={schema} onSubmit={props.onSubmit} initialValues={props.start} onReset={() => props.onSubmit(undefined)}>
            {({ handleSubmit, handleChange, handleReset, values, touched, errors }) => (
                <Form noValidate onSubmit={handleSubmit} onReset={handleReset} className="bg-light p-3">
                    <Form.Row>
                        <Form.Group as={Col} controlId="name" className="col-2">
                            <Form.Label>Название</Form.Label>
                            <Form.Control type="text" value={values.name} name="name" maxLength={50}
                                onChange={handleChange} isInvalid={touched.name && !!errors.name} />
                            <Feedback type="invalid">{errors.name}</Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="plannedStart" className="col-2">
                            <Form.Label>Время старта</Form.Label>
                            <Form.Control type="time" value={values.plannedStart && values.plannedStart.includes('T')
                                && values.plannedStart.substring(values.plannedStart.indexOf('T') + 1) || values.plannedStart || ''}
                                name="plannedStart"
                                onChange={handleChange} isInvalid={touched.plannedStart && !!errors.plannedStart} />
                            <Feedback type="invalid">{errors.plannedStart}</Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Button variant="primary" type="submit">{`${values.id ? 'Сохранить' : 'Добавить'} заезд`}</Button>
                        <Button variant="secondary" type="reset" className="ml-3">Отмена</Button>
                    </Form.Row>
                </Form>
            )}
        </Formik>
    )
}

export default EditStart
