import { RouteComponentProps } from "react-router";
import React from "react";
import { Form, Button, Alert, Row, Spinner, Col } from "react-bootstrap";
import { object as yupObject, string as yupString, date as yupDate } from 'yup'
import { Formik } from 'formik'
import { RaceDto, RacesClient, RaceType } from "../clients";
import moment from "moment";


const schema = yupObject({
    name: yupString().required('Название обязательно'),
    date: yupDate().required('Дата обязательна'),
    description: yupString().notRequired()
})

type Values = Pick<RaceDto, "id" | "description" | "name" | "type"> & { date: string }

const InitialState = {
    raceId: 0,
    values: null as Values | null,
    sending: false,
    error: null as string | null
}

type Props = RouteComponentProps<{ id?: string }>;

export default class RaceEdit extends React.Component<Props, typeof InitialState> {
    constructor(props: Props) {
        super(props);
        this.state = InitialState;
        this.onSubmit = this.onSubmit.bind(this)
    }

    public async componentDidMount() {
        try {
            if (this.props.match.params.id) {
                const raceId = parseInt(this.props.match.params.id, 10)
                const race = await new RacesClient().get(raceId)
                const values = {
                    ...race , 
                    date: moment(race.date).format('YYYY-MM-DD')
                }
                this.setState({ values })
            } else {
                const values = { name: '', description: '', date: moment().format('YYYY-MM-DD'), id: 0, type: RaceType.Laps }
                this.setState({values});
            }
        }
        catch (ex) {
            this.setState({ error: ex.toString() })
        }
    }

    public async onSubmit(values: Values) {
        this.setState({ sending: true });
        try {
            const race = new RaceDto({
                ...values,
                date: moment.utc(values.date).toDate()
            })
            if (values.id) {
                await new RacesClient().updateRace(race)
            }
            else {
                await new RacesClient().createRace(race)
            }
            this.props.history.goBack();
        } catch (ex) {
            this.setState({ error: ex.toString(), sending: false })
        }
    }

    public render() {
        return (
            <Row><Col>
                {!this.state.values && !this.state.error && <Spinner animation="grow" />}
                {this.state.error && <Alert className="mt-3" variant="danger">{this.state.error}</Alert>}
                {this.state.values && (<>
                    <h1>{this.state.values.id ? this.state.values.name : 'Новая гонка'}</h1>
                    <Formik initialValues={this.state.values} validationSchema={schema} onSubmit={this.onSubmit}>
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
                                        checked={values.type + '' === RaceType.Laps + ''}
                                        value={RaceType.Laps}
                                        name="type"
                                        label="Групповая гонка"
                                        onChange={handleChange}
                                        isInvalid={!!errors.type}
                                        id="typeLaps"
                                    />
                                    <Form.Check type="radio"
                                        checked={values.type + '' === RaceType.TimeTrial + ''}
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
                                    <Form.Label>Описание</Form.Label>
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