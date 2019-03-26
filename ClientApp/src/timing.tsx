import React, { Component } from "react";
import { Button, Container } from "react-bootstrap";
import Timer from "./timer";
import Svc, { Mark } from './svc';
import MarkView from "./markView";

const InitialState = {
    startTime: undefined as Date | undefined,
    marks: undefined as Mark[] | undefined
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
        // attach to keyboard press
        document.addEventListener('keydown', this.onKeyDown);
        Svc.Marks.subscribe(marks => this.setState({ marks }))
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown)
        Svc.Marks.unsubscribe();
    }

    onKeyDown(e: KeyboardEvent) {
        if (e.key === ' ' || e.key === 'Spacebar') {
            Svc.AddMarkNow('UI');

        } else if (e.key === 'Enter') {

        }
    }

    start() {
        this.setState({ startTime: new Date() });
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
                            <MarkView mark={mark} start={this.state.startTime!!} key={ind} />
                        )}</div>
                        <div className="bg-secondary">Нижняя часть</div>
                    </div>
                }
            </Container>
        );
    }
}