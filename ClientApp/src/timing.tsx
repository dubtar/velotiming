import React, { Component } from "react";
import { Button, Container } from "react-bootstrap";
import Timer from "./timer";
import Svc, { Mark, RaceInfo } from './svc';
import MarkView from "./markView";

const InitialState = {
    race: undefined as RaceInfo | undefined,
    marks: undefined as Mark[] | undefined,
    number: ''

}

type Props = {}

export default class Timing extends Component<Props, typeof InitialState> {

    constructor(props: Props) {
        super(props);
        this.state = InitialState;
        this.start = this.start.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    componentDidMount() {
        Svc.init();
        Svc.GetRaceInfo().then(race => {
            this.setState({ race: race })

            // attach to keyboard press
            document.addEventListener('keydown', this.onKeyDown);
        });
        Svc.Marks.subscribe(marks => this.setState({ marks }));
        Svc.Race.subscribe(race => this.setState({ race }));
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown)
        Svc.Marks.unsubscribe();
        Svc.Race.unsubscribe();
    }

    onKeyDown(e: KeyboardEvent) {
        if (!this.state.race) return;
        if (e.repeat) return; // не отвечать на зажатую клавишу. Может предупреждать о кошке, сидящей на кнопке
        if (e.key === ' ' || e.key === 'Spacebar') {
            Svc.AddTime('UI');
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
        Svc.StartRace();
    }

    render() {
        if (!this.state.race) return <Container>Соединение...</Container>
        return (
            <Container className="flex-fill">
                <div className="d-flex h-100 flex-column">
                    <div className="d-flex justify-content-between">
                        <h1>{this.state.race.name}</h1>
                        {this.state.race.start && <h1><Timer start={this.state.race.start} /></h1>}
                    </div>
                    <div className="flex-fill">
                        {!this.state.race.start &&
                            <Button onClick={this.start} className="m-3">Начать гонку</Button>
                        }
                        {this.state.race.start && this.state.marks && this.state.marks.map((mark, ind) =>
                            <MarkView mark={mark} start={this.state.race!!.start!!} key={ind} />)}
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
            </Container>
        );
    }
}