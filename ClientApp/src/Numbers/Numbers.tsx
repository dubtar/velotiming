import React from 'react'
import { RouteComponentProps, Route } from "react-router-dom";
import { Container } from 'react-bootstrap'
import NumberList from './NumberList'

type Props = RouteComponentProps<{}>;

const Numbers: React.SFC<Props> = (props) => (
    <Container>
        <Route path={props.match.path} exact={true} component={NumberList} />
    </Container>
)

export default Numbers