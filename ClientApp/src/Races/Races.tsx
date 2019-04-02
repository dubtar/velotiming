import React from "react";
import { Container, Row, Button, Table } from "react-bootstrap";
import { Link, RouteComponentProps, Router, Route } from "react-router-dom";
import RaceList from "./RaceList";
import RaceAdd from "./RaceAdd";

type Props = RouteComponentProps<{}>;

const Races: React.SFC<Props> = (props) => {
    return (
        <Container>
            <Route path={`${props.match.path}/add`} component={RaceAdd} />
            <Route path={props.match.path} exact={true} render={(props) =>
                <>
                    <RaceList {...props} />
                    <Row>
                        <Link to={`${props.match.url}/add`} className="btn btn-primary">
                            Добавить гонку
                        </Link>
                    </Row>
                </>
            } />
        </Container>);
}

export default Races;

export interface Race {
    id: number;
    name: string;
    date: string;
    description: string;
}