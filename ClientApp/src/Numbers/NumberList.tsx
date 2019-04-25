import React from 'react'
import { Alert, Row, Spinner } from 'react-bootstrap'
import NumberService, { INumber } from './NumberService'

type Props = {}

interface IEditNumber {
    id: string,
    rfids: Array<{ rfidId: string, selected: boolean }>
}

const InitialState = {
    editNumber: null as IEditNumber | null,
    error: null as string | null,
    numbers: null as INumber[] | null
}

export default class NumberList extends React.Component<Props, typeof InitialState> {
    constructor(props: Props) {
        super(props)
        this.state = InitialState
        this.addNumber = this.addNumber.bind(this)
        this.saveNumber = this.saveNumber.bind(this)
    }

    public async componentDidMount() {
        try {
            const numbers = await NumberService.GetAllNumbers()
            this.setState({ numbers })
        } catch (ex) {
            this.setState({ error: ex.toString() })
        }
    }

    public addNumber() {
        this.setState({ editNumber: { id: '', rfids: [] } })
    }

    public editNumber(num: INumber) {
        this.setState({ editNumber: { id: num.id, rfids: num.rfids.map(r => ({ selected: true, rfidId: r })) } })
    }

    public async deleteNumber(num: string) {
        if (confirm('Удалить участника?')) {
            try {
                const numbers = await NumberService.DeleteNumber(num);
                this.setState({ numbers })

            } catch (ex) {
                this.setState({ error: ex.toString() })
            }
        }
    }

    public render() {
        return (
            <Row>
                {this.state.numbers && (
                    <>
                        <h1>Гонки</h1>
                        {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
                        {!this.state.numbers && <Spinner animation="grow" />}
                    </>
                )}
            </Row>
        )
    }
}