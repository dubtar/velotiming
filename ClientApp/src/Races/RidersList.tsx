import React from "react";
import RaceService, { Rider, Sex, RaceCategory } from "./RaceService";
import { Table, Row, Col, Alert, Spinner, Button, ButtonGroup } from "react-bootstrap";
import EditRider from "./EditRider";
import RiderRfidEdit from "./RiderRfidEdit";

const InitialState = {
    riders: null as Rider[] | null,
    categories: null as RaceCategory[] | null,
    editRider: null as Rider | null,
    rfidRiderEdit: null as Rider | null,
    error: null as string | null
}

type Props = { raceId: number }

export default class RidersList extends React.Component<Props, typeof InitialState> {

    constructor(props: Props) {
        super(props)
        this.state = InitialState
        this.addRider = this.addRider.bind(this)
        this.saveRider = this.saveRider.bind(this)
        this.saveRfid = this.saveRfid.bind(this)
    }

    async componentDidMount() {
        RaceService.GetRaceCategories(this.props.raceId).then(categories => {
            this.setState({ categories })
        }, error => { this.setState({ error }) });
        try {
            const riders = await RaceService.GetRiders(this.props.raceId)
            this.setState({ riders })
        } catch (ex) {
            this.setState({ error: ex.toString() })
        }
    }

    addRider() {
        this.setState({ editRider: { id: 0, firstName: '', lastName: '', sex: undefined } })
    }

    editRider(editRider: Rider) {
        this.setState({ editRider })
    }

    setRfid(rider: Rider) {
        this.setState({ rfidRiderEdit: rider })
    }

    async saveRfid(rfidId: string | undefined, riderId: number) {
        if (rfidId) {
            try {
                const riders = await RaceService.SetRiderRfid(riderId, rfidId)
                this.setState({ riders })
            } catch (ex) {
                this.setState({ error: ex.toString() })
            }

        }
        this.setState({ rfidRiderEdit: null })
    }

    async deleteRider(riderId: number) {
        if (confirm('Удалить участника?'))
            try {
                const riders = await RaceService.DeleteRider(riderId);
                this.setState({ riders })

            } catch (ex) {
                this.setState({ error: ex.toString() })
            }
    }

    async saveRider(rider?: Rider) {
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

    render() {
        var i = 1;
        return (
            <>
                {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
                {!this.state.riders && <Spinner animation="grow" />}
                {this.state.riders && (
                    <>
                        {this.state.editRider !== null && this.state.categories &&
                            <EditRider rider={this.state.editRider} categories={this.state.categories} onSubmit={this.saveRider} />}
                        {this.state.editRider === null && this.state.rfidRiderEdit === null && <Button className="mv-3" onClick={this.addRider}>Добавить участника</Button>}
                        {this.state.rfidRiderEdit && <RiderRfidEdit rider={this.state.rfidRiderEdit} onSave={this.saveRfid} />}
                        <Row><Col>
                            <Table striped hover bordered>
                                <thead><tr>
                                    <th></th>
                                    <th>Номер</th>
                                    <th>Имя</th>
                                    <th>Пол</th>
                                    <th>Г.р.</th>
                                    <th>Возр.</th>
                                    <th>Кат.</th>
                                    <th>Город</th>
                                    <th>Команда</th>
                                    <th>Rfid</th>
                                    <th></th>
                                </tr></thead>
                                <tbody>
                                    {this.state.riders.map(rider => (
                                        <tr key={rider.id}>
                                            <td>{i++}</td>
                                            <td>{rider.number}</td>
                                            <td>{`${rider.lastName} ${rider.firstName}`}</td>
                                            <td>{rider.sex == Sex.Female ? 'Ж' : 'М'}</td>
                                            <td>{rider.yearOfBirth}</td>
                                            <td>{rider.yearOfBirth && (new Date().getFullYear() - rider.yearOfBirth)}</td>
                                            <td>{rider.category}</td>
                                            <td>{rider.city}</td>
                                            <td>{rider.team}</td>
                                            <td>{rider.rfids && (rider.rfids.length < 9 && rider.rfids ||
                                                    `${rider.rfids.substring(0, 3)}...${rider.rfids.substring(rider.rfids.length - 3)}`)}</td>
                                            <td>
                                                <ButtonGroup>
                                                    <Button variant="primary" onClick={this.setRfid.bind(this, rider)}>Чип</Button>
                                                    <Button variant="outline-primary" onClick={this.editRider.bind(this, rider)}>Изменить</Button>
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