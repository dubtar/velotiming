import React from 'react'
import RaceService, { RaceCategory, Rider, Sex } from './RaceService'
import { string as yupString, number as yupNumber, ref as yupRef, object as yupObject } from 'yup'
import { Formik } from 'formik';
import { Form, Col, Button } from 'react-bootstrap'
import Feedback from 'react-bootstrap/Feedback';
import * as signalR from '@aspnet/signalr';

interface Props {
    raceId: number
    rider: Rider
    onSubmit: (rider?: Rider) => void
}

const schema = yupObject({
    number: yupString().nullable(),
    firstName: yupString().required('Фамилия обязательна'),
    lastName: yupString().required('Имя обязательно'),
    sex: yupString().required('Пол обязателен'),
    yearOfBirth: yupNumber().nullable().lessThan(new Date().getFullYear(), 'Не похож на г.р.').moreThan(1900, 'Не похож на г.р.')
})

const InitialState = { rfidNumber: '', categories: null as RaceCategory[] | null }

export default class EditRider extends React.Component<Props, typeof InitialState> {
    private sRconn: signalR.HubConnection | undefined

    constructor(props: Props) {
        super(props)
        this.state = InitialState
    }


    public componentDidMount() {
        RaceService.GetRaceCategories(this.props.raceId).then(categories => {
            this.setState({ categories })
        })
        this.sRconn = new signalR.HubConnectionBuilder().withUrl('/rfidHub').build();
        this.sRconn.on("NumberFound", (rfidNumber: string) => {
            this.setState({ rfidNumber });
        })
        this.sRconn.start();
    }

    public componentWillUnmount() {
        if (this.sRconn) this.sRconn.stop()
    }

    public render() {
        const categories = this.state.categories;
        if (!categories) return <div />;
        else {
            return (
                <Formik validationSchema={schema} onSubmit={this.props.onSubmit} initialValues={this.props.rider}
                    onReset={this.props.onSubmit.bind(this, undefined)}>
                    {({ handleSubmit, handleChange, handleReset, values, touched, errors, setFieldValue }) => (
                        <Form noValidate onSubmit={handleSubmit} onReset={handleReset} className="bg-light p-3">
                            <Form.Row>
                                <Form.Group as={Col} controlId="number" className="col-1">
                                    <Form.Label>Номер</Form.Label>
                                    <Form.Control type="text" value={values.number} name="number" maxLength={50}
                                        onChange={handleChange} isInvalid={touched.number && !!errors.number} />
                                    <Feedback type="invalid">{errors.number}</Feedback>
                                </Form.Group>
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
                                <Form.Group as={Col} controlId="sex" className="col-1">
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
                                <Form.Group as={Col} controlId="yearOfBirth" className="col-1">
                                    <Form.Label>Г.р.</Form.Label>
                                    <Form.Control type="number" value={values.yearOfBirth && values.yearOfBirth.toString() || ''}
                                        name="yearOfBirth" onChange={this.onChangeAndSetDefaultCategory({ handleChange, values, categories, setFieldValue })}
                                        isInvalid={touched.yearOfBirth && !!errors.yearOfBirth} />
                                    <Feedback type="invalid">{errors.yearOfBirth}</Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="category" className="col-2">
                                    <Form.Label>Категория</Form.Label>
                                    <Form.Control as="select" name="category" onChange={handleChange}
                                        isInvalid={touched.category && !!errors.category} value={values.category}>
                                        <option />
                                        {this.state.categories && this.state.categories.map(cat => (
                                            <option key={cat.id} value={cat.code}>{cat.name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlId="city" className="col-1">
                                    <Form.Label>Город</Form.Label>
                                    <Form.Control type="text" maxLength={50} name="city" onChange={handleChange}
                                        isInvalid={touched.city && !!errors.city} value={values.city} />
                                    <Feedback type="invalid">{errors.city}</Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="team" className="col-2">
                                    <Form.Label>Команда</Form.Label>
                                    <Form.Control type="text" maxLength={50} name="team" onChange={handleChange}
                                        isInvalid={touched.team && !!errors.team} value={values.team} />
                                    <Feedback type="invalid">{errors.team}</Feedback>
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
    }

    private onChangeAndSetDefaultCategory({ handleChange, values, categories, setFieldValue }:
        { handleChange: (e: React.ChangeEvent<EventTarget>) => void; values: Rider; categories: RaceCategory[]; setFieldValue: (field: string, value: any) => void; }) {
        return (e: React.ChangeEvent<EventTarget>) => {
            handleChange(e);
            const yearText = (e.target as HTMLInputElement).value;
            const year = yearText && parseInt(yearText, 10) || 0;
            const sex = values.sex;
            if (sex && year > 1900 && year < new Date().getFullYear() && !values.category) {
                const category = categories.find(cat => cat.sex === sex &&
                    (!cat.minYearOfBirth || cat.minYearOfBirth <= year) &&
                    (!cat.maxYearOfBirth || cat.maxYearOfBirth >= year));
                if (category) setFieldValue('category', category.code);
            }
        };
    }
}
