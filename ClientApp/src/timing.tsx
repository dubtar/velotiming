import React, { Component } from "react";
import { Button, Container } from "react-bootstrap";
import Timer from "./timer";
import Svc, { Mark } from './svc';
import MarkView from "./markView";

const InitialState = {
    startTime: undefined as Date | undefined,
    marks: undefined as Mark[] | undefined,
    number: ''
}

type Props = {}

const START_TIME = 'startTime';

export default class Timing extends Component<Props, typeof InitialState> {

    constructor(props: Props) {
        super(props);
        let storedStart = sessionStorage.getItem(START_TIME);
        if (storedStart) {
            let startTime = new Date(storedStart);
            this.state = { ...InitialState, startTime };
        } else
            this.state = InitialState;
        this.start = this.start.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    componentDidMount() {
        // attach to keyboard press
        document.addEventListener('keydown', this.onKeyDown);
        Svc.Marks.subscribe(marks => this.setState({ marks }))
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown)
        Svc.Marks.unsubscribe();
    }

    onKeyDown(e: KeyboardEvent) {
        if (e.repeat) return; // не отвечать на зажатую клавишу. Может предупреждать о кошке, сидящей на кнопке
        if (e.key === ' ' || e.key === 'Spacebar') {
            Svc.AddMarkNow('UI');
        } else if (e.key in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) { // >= '0' && e.key <= '9') {
            this.setState({ number: this.state.number + e.key });
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            let num = this.state.number;
            if (num.length)
                this.setState({ number: num.substring(0, num.length - 1) });

            // Чтобы не переходило на предыдущую страницу браузера.
            // Возможно, надо будет отключать для элементов input
            e.preventDefault();
        } else if (e.key === 'Enter') {
            let number = this.state.number;
            if (number) {
                Svc.AddNumber(number, 'UI');
                this.setState({ number: '' })
            }
        }
    }

    start() {
        let startTime = new Date();
        sessionStorage.setItem(START_TIME, startTime.toUTCString());
        this.setState({ startTime });
    }

    render() {
        return (
            <Container className="flex-fill">
                {!this.state.startTime &&
                    <Button onClick={this.start} className="m-3">Начать гонку</Button>
                }
                {this.state.startTime &&
                    <div className="d-flex h-100 flex-column">
                        <div className="d-flex justify-content-between">
                            <h1>Гонка</h1>
                            <h1><Timer start={this.state.startTime!!} /></h1>
                        </div>
                        <div className="flex-fill">{this.state.marks && this.state.marks.map((mark, ind) =>
                            <MarkView mark={mark} start={this.state.startTime!!} key={ind} />)}
                        </div>
                        {/* Нижняя часть */}
                        <div className="bg-light">
                            {this.state.number &&
                                <div className="d-inline-block border border-secondary rounded p-3">
                                    {this.state.number}
                                </div>
                            }
                            <div className="text-muted">Space - отметка времени, цифры - ввод номера, Enter - запись введённого номера</div>
                        </div>
                    </div>
                }
            </Container>
        );
    }
}