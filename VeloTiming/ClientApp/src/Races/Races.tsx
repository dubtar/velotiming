import React from "react";
import { Container } from "react-bootstrap";
import { RouteComponentProps, Route } from "react-router-dom";
import RaceList from "./RaceList";
import RaceEdit from "./RaceEdit";
import RaceView from "./RaceView";
import StartResults from "./StartResults";

type Props = RouteComponentProps<{}>;

const Races: React.SFC<Props> = (props) => {
    return (
        <Container>
            <Route path={`${props.match.path}/results/:id?`} component={StartResults} />
            <Route path={`${props.match.path}/add/:id?`} component={RaceEdit} />
            <Route path={`${props.match.path}/:id(\\d)`} component={RaceView} />
            <Route path={props.match.path} exact={true} component={RaceList} />
        </Container>);
}

export default Races;