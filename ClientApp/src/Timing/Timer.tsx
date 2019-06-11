import React, { Component } from 'react';
import Svc from '../svc';

type Props = {
    start: Date
}

export default class Timer extends Component<Props, { now: Date }> {
    private timer = undefined as undefined | NodeJS.Timeout;

    constructor(props: Props) {
        super(props);
        this.tick = this.tick.bind(this);
        this.state = { now: new Date() };
    }

    public componentDidMount() {
        this.timer = setInterval(this.tick, 1000);
    }

    public componentWillUnmount() {
        if (this.timer) clearInterval(this.timer);
    }

    public render() {
        return <span>{Svc.formatTime(this.state.now, this.props.start)}</span>;
    }

    private tick() {
        this.setState({ now: new Date() });
    }
}