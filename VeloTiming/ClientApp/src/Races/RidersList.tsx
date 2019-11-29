import React from 'react';
import { Alert, Button, ButtonGroup, Col, Row, Spinner, Table } from 'react-bootstrap';
import EditRider from './EditRider';
import RaceService, { RaceCategory, Rider, Sex } from './RaceService';

const InitialState = {
    editRider: null as Rider | null,
    error: null as string | null,
    riders: null as Rider[] | null
}

type Props = { raceId: number }

export default class RidersList extends React.Component<Props, typeof InitialState> {

    constructor(props: Props) {
        super(props)
        this.state = InitialState
        this.addRider = this.addRider.bind(this)
        this.saveRider = this.saveRider.bind(this)
        this.onKeyPress = this.onKeyPress.bind(this)
    }

    public async componentDidMount() {
        try {
            const riders = await RaceService.GetRiders(this.props.raceId)
            this.setState({ riders })
        } catch (ex) {
            this.setState({ error: ex.toString() })
        }
        document.addEventListener('keydown', this.onKeyPress)
    }
    public componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyPress)
    }

    public addRider() {
        this.setState({ editRider: { id: 0, firstName: '', lastName: '', sex: undefined } })
    }

    public editRider(editRider: Rider) {
        this.setState({ editRider })
    }

    public onKeyPress(ev: KeyboardEvent)
    {
        if (ev.key === 'Insert') this.addRider()
    }

    public async deleteRider(riderId: number) {
        if (confirm('Удалить участника?')) {
            try {
                const riders = await RaceService.DeleteRider(riderId);
                this.setState({ riders })

            } catch (ex) {
                this.setState({ error: ex.toString() })
            }
        }
    }

    public async saveRider(rider?: Rider) {
        try {
            if (rider) {
                const riders = rider.id ?  // edit exiting
                    await RaceService.UpdateRider(rider) :
                    // add new
                    await RaceService.AddRider(this.props.raceId, rider)
                this.setState({ riders })
            }
        } catch (ex) {
            this.setState({ error: ex.toString() })
        }
        // close editor
        this.setState({ editRider: null })
    }

    public render() {
        let i = 1;
        return (
            <>
                {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
                {!this.state.riders && <Spinner animation="grow" />}
                {this.state.riders && (
                    <>
                        {this.state.editRider !== null && 
                            <EditRider rider={this.state.editRider} raceId={this.props.raceId} onSubmit={this.saveRider} />}
                        {this.state.editRider === null &&  <Button className="mv-3" onClick={this.addRider}>Добавить участника</Button>}
                        <Row><Col>
                            <Table striped={true} hover={true} bordered={true}>
                                <thead><tr>
                                    <th/>
                                    <th>Номер</th>
                                    <th>Имя</th>
                                    <th>Пол</th>
                                    <th>Г.р.</th>
                                    <th>Возр.</th>
                                    <th>Кат.</th>
                                    <th>Город</th>
                                    <th>Команда</th>
                                    <th/>
                                </tr></thead>
                                <tbody>
                                    {this.state.riders.map(rider => (
                                        <tr key={rider.id}>
                                            <td>{i++}</td>
                                            <td>{rider.number}</td>
                                            <td>{`${rider.lastName} ${rider.firstName}`}</td>
                                            <td>{rider.sex === Sex.Female ? 'Ж' : 'М'}</td>
                                            <td>{rider.yearOfBirth}</td>
                                            <td>{rider.yearOfBirth && (new Date().getFullYear() - rider.yearOfBirth)}</td>
                                            <td>{rider.category}</td>
                                            <td>{rider.city}</td>
                                            <td>{rider.team}</td>
                                            <td>
                                                <ButtonGroup>
                                                    <Button variant="primary" onClick={this.editRider.bind(this, rider)}>Изменить</Button>
                                                    <Button variant="outline-danger" onClick={this.deleteRider.bind(this, rider.id)}>Удалить</Button>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col></Row>
                    </>
                )}
            </>
        )
    }

}