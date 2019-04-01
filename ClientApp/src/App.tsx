import React, { Component } from "react";
import { Route, Switch, Router, Redirect } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, Container, Row } from "react-bootstrap";
import Timing from "./timing";
import moment from 'moment';
import 'moment/locale/ru';
import Races from './Races/Races';
import { createBrowserHistory } from "history";

moment.locale('ru');

const history = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <div className="h-100 d-flex flex-column">
        <Navbar bg="primary" variant="dark">
          <Container>
            <Navbar.Brand >ВелоКурск тайминг</Navbar.Brand>
          </Container>
        </Navbar>
        <Router history={history}>
            <Route path="/run" component={Timing} />
            <Route path="/races" component={Races} />
            <Route path="/" exact={true} render={(props) => <Redirect to="/races" />}/>
        </Router>
      </div>
    );
  }
}

export default App;
