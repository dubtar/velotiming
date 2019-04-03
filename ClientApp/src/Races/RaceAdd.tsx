import { RouteComponentProps, Redirect } from "react-router";
import React from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { object as yupObject, string as yupString, number as yupNumber, date as yupDate } from 'yup'
import { Formik } from 'formik'
import RaceService from "./RaceService";


const schema = yupObject({
    name: yupString().required('Название обязательно'),
    date: yupDate().required('Дата обязательна'),
    description: yupString().notRequired(),
    type: yupNumber().min(1, 'Тип гонки обязателен')
})

enum RaceType {
    Laps = 1, TimeTrial = 2 // timetrial, criterium
}

const initialFormValues = {
    name: '',
    date: undefined as string | undefined,
    description: '',
    type: RaceType.Laps
}

const InitialState = {
    done: false,
    sending: false,
    error: null as string | null
}

type Props = RouteComponentProps<{}>;

type FormValues = typeof initialFormValues;

export default class RaceAdd extends React.Component<Props, typeof InitialState> {
    constructor(props: Props) {
        super(props);
        this.state = InitialState;
        this.onSubmit = this.onSubmit.bind(this)
    }

    async onSubmit(values: FormValues) {
        this.setState({ sending: true });
        try {
            await RaceService.AddRace(values)
            this.setState({ done: true, sending: false })
        } catch (ex) {
            this.setState({ error: ex.toString(), sending: false })
        }
    }

    render() {
        if (this.state.done) return <Redirect to="../" />;
        return (
            <>
                <h1>Новая гонка</h1>
                <Formik initialValues={initialFormValues} validationSchema={schema} onSubmit={this.onSubmit}>
                    {({ values, touched, errors, handleSubmit, handleChange }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group controlId="date">
                                <Form.Label>Дата</Form.Label>
                                <Form.Control required type="date" placeholder="Дата гонки" name="date"
                                    value={values.date} onChange={handleChange}
                                    isInvalid={touched.date && !!errors.date} isValid={touched.date && !errors.date}
                                />
                                <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="name">
                                <Form.Label>Название</Form.Label>
                                <Form.Control required type="text" placeholder="Название гонки" name="name"
                                    value={values.name} onChange={handleChange}
                                    isValid={touched.name && !errors.name}
                                    isInvalid={touched.name && !!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="type">
                                <Form.Label>Тип</Form.Label>
                                <Form.Check type="radio"
                                    checked={values.type === RaceType.Laps}
                                    value={RaceType.Laps}
                                    name="type"
                                    label="Групповая гонка"
                                    onChange={handleChange}
                                    isInvalid={!!errors.type}
                                    id="typeLaps"
                                />
                                <Form.Check type="radio"
                                    checked={values.type === RaceType.TimeTrial}
                                    value={RaceType.TimeTrial}
                                    name="type"
                                    label="Раздельный старт"
                                    feedback={errors.type}
                                    onChange={handleChange}
                                    isInvalid={!!errors.type}
                                    id="typeTT"
                                />
                                <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="description">
                                <Form.Label>Название</Form.Label>
                                <Form.Control type="textarea" placeholder="Описание" name="description"
                                    value={values.description} onChange={handleChange} isValid={touched.description && !errors.description} />
                                <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                            </Form.Group>
                            <Button type="submit" disabled={this.state.sending}>Добавить</Button>
                            {this.state.error && <Alert className="mt-3" variant="danger">{this.state.error}</Alert>}
                        </Form>
                    )}
                </Formik>
            </>
        );
    }

}