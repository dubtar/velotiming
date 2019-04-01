import { RouteComponentProps } from "react-router";
import React from "react";

const InitialState = {

}

type Props = RouteComponentProps<{}>;

export default class RaceAdd extends React.Component<Props, typeof InitialState> {
    constructor(props: Props) {
        super(props);
        this.state = InitialState;
    }

    render() {
        return <h1>Новая гонка</h1>;
    }

}