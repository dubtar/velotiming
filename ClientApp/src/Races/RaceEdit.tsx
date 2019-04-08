import { RouteComponentProps } from "react-router";
import React from "react";
import { Form, Button, Alert, Row, Spinner, Col } from "react-bootstrap";
import { object as yupObject, string as yupString, number as yupNumber, date as yupDate, number } from 'yup'
import { Formik } from 'formik'
import RaceService, { Race, RaceType } from "./RaceService";


const schema = yupObject({
    name: yupString().required('Название обязательно'),
    date: yupDate().required('Дата обязательна'),
    description: yupString().notRequired()
})

const InitialState = {
    raceId: 0,
    race: null as Partial<Race> | null,
    sending: false,
    error: null as string | null
}

type Props = RouteComponentProps<{ id?: string }>;

export default class RaceEdit extends React.Component<Props, typeof InitialState> {
    constructor(props: Props) {
        super(props);
        const state = { ...InitialState }
        if (this.props.match.params.id)
            state.raceId = parseInt(this.props.match.params.id)
        else
            state.race = {}
        this.state = state;
        this.onSubmit = this.onSubmit.bind(this)
    }

    async componentDidMount() {
        try {
            if (this.state.raceId) {
                const race = await RaceService.GetRace(this.state.raceId)
                if (race && race.date) {
                    const ind = race.date.indexOf('T')
                    if (ind) race.date = race.date.substring(0, ind)
                }
                this.setState({ race })
            }
        }
        catch (ex) {
            this.setState({ error: ex.toString() })
        }
    }

    async onSubmit(values: Partial<Race>) {
        this.setState({ sending: true });
        try {
            if (values.id)
                await RaceService.UpdateRace(values)
            else
                await RaceService.AddRace(values)
            this.props.history.goBack();
        } catch (ex) {
            this.setState({ error: ex.toString(), sending: false })
        }
    }

    render() {
        return (
            <Row><Col>
                {!this.state.race && !this.state.error && <Spinner animation="grow" />}
                {this.state.error && <Alert className="mt-3" variant="danger">{this.state.error}</Alert>}
                {this.state.race && (<>
                    <h1>{this.state.race.id ? this.state.race.name : 'Новая гонка'}</h1>
                    <Formik initialValues={this.state.race} validationSchema={schema} onSubmit={this.onSubmit}>
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
                                <Button type="submit" disabled={this.state.sending}>{this.props.match.params.id ? 'Изменить' : 'Добавить'}</Button>
                            </Form>
                        )}
                    </Formik>
                </>)
                }
            </Col></Row>
        );
    }

}