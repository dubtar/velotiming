import React, { Component } from 'react';
import moment from 'moment';
import Svc from './svc';

type Props = {
    start: Date
}

export default class Timer extends Component<Props, { now: Date }> {
    constructor(props: Props) {
        super(props);
        this.tick = this.tick.bind(this);
        this.state = { now: new Date() };
    }

    timer = undefined as undefined | NodeJS.Timeout;

    private tick() {
        this.setState({ now: new Date() });
    }

    componentDidMount() {
        this.timer = setInterval(this.tick, 1000);
    }

    componentWillUnmount() {
        if (this.timer) clearInterval(this.timer);
    }

    render() {
        return <span>{Svc.formatTime(this.state.now, this.props.start)}</span>;
    }
}