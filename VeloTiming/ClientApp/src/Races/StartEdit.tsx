import React from 'react'
import { object as yupObject, string as yupString, number as yupNumber } from 'yup'
import { Formik } from 'formik';
import { Form, Col, Button } from 'react-bootstrap'
import Feedback from 'react-bootstrap/Feedback';
import { StartDto, RaceCategoryDto, IStartDto, StartType } from '../clients';
import moment from 'moment';

interface Props {
    start: StartDto
    categories: RaceCategoryDto[]
    onSubmit: (start?: StartDto) => void
}


const schema = yupObject({
    name: yupString().required('Как-нибудь хоть назови'),
    plannedStart: yupString().nullable(),
    delayMarksAfterStartMinutes: yupNumber().integer('Должно быть число').positive('Нужно положительное число').required('Необходимо')
})
interface CategoryValues { [key: number]: boolean }
type FormValues = Omit<Omit<IStartDto, "plannedStart">, "delayMarksAfterStartMinutes">
    & { categoryChecks: CategoryValues, plannedStart: string, delayMarksAfterStartMinutes: string }

const StartEdit: React.SFC<Props> = (props) => {
    function onSubmit(values: FormValues) {
        const cats: RaceCategoryDto[] = []
        for (const key in values.categoryChecks) {
            if (values.categoryChecks.hasOwnProperty(key)) {
                const id = parseInt(key, 10)
                const category = props.categories.find(c => c.id === id)
                if (values.categoryChecks[key] && category) {
                    cats.push(new RaceCategoryDto(category))
                    // console.log(`${key}: ${values.categoryChecks[key]} (${category.code})`)
                }
            }
        }
        let plannedStart: Date | undefined
        if (values.plannedStart) {
            plannedStart = moment(values.plannedStart, "hh:mm").toDate()
        }
        const delayMarksAfterStartMinutes = parseInt(values.delayMarksAfterStartMinutes, 10);
        const result = new StartDto({ ...values, categories: cats, plannedStart, delayMarksAfterStartMinutes })
        props.onSubmit(result)
    }

    const catProps = {} as CategoryValues
    props.categories.forEach(cat => { catProps[cat.id] = props.start?.categories?.find(sc => sc.id === cat.id) !== undefined })
    const formValues: FormValues = {
        ...props.start,
        delayMarksAfterStartMinutes: props.start.delayMarksAfterStartMinutes.toString(),
        categoryChecks: catProps,
        plannedStart: props.start.plannedStart?.toLocaleTimeString() || ''
    }

    function onReset() {
        props.onSubmit(undefined);
    }

    return (
        <Formik validationSchema={schema} onSubmit={onSubmit} initialValues={formValues} onReset={onReset}>
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
                            <Form.Control type="time" value={values.plannedStart}
                                name="plannedStart"
                                onChange={handleChange} isInvalid={touched.plannedStart && !!errors.plannedStart} />
                            <Feedback type="invalid">{errors.plannedStart}</Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="delayMarksAfterStartMinutes" className="col-1">
                            <Form.Label title="Сколько минут не добавлять результаты после старта">Задержка</Form.Label>
                            <Form.Control type="number" value={values.delayMarksAfterStartMinutes}
                                name="delayMarksAfterStartMinutes"
                                onChange={handleChange}
                                isInvalid={!!errors.delayMarksAfterStartMinutes} />
                            <Feedback type="invalid">{errors.delayMarksAfterStartMinutes}</Feedback>
                        </Form.Group>
                        <Form.Group controlId="type">
                            <Form.Label>Тип</Form.Label>
                            <Form.Check type="radio"
                                checked={values.type + '' === StartType.Laps + ''}
                                value={StartType.Laps}
                                name="type"
                                label="Групповая гонка"
                                onChange={handleChange}
                                isInvalid={!!errors.type}
                                id="typeLaps"
                            />
                            <Form.Check type="radio"
                                checked={values.type + '' === StartType.TimeTrial + ''}
                                value={StartType.TimeTrial}
                                name="type"
                                label="Раздельный старт"
                                feedback={errors.type}
                                onChange={handleChange}
                                isInvalid={!!errors.type}
                                id="typeTT"
                            />
                            <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="categories">
                            <Form.Label>Категории</Form.Label>
                            <Form.Row>
                                {props.categories.map(c => (
                                    <Form.Check key={c.id} id={`categoryChecks.${c.id}`} name={`categoryChecks.${c.id}`}
                                        checked={values.categoryChecks[c.id]}
                                        custom inline label={`${c.code} ${c.name}`} onChange={handleChange} />
                                ))}
                            </Form.Row>
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

export default StartEdit
