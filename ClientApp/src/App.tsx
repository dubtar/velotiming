import React, { Component } from "react";
import { Route, Router, Redirect, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, Container, Nav } from "react-bootstrap";
import Timing from "./timing";
import moment from "moment";
import "moment/locale/ru";
import Races from "./Races/Races";
import { createBrowserHistory } from "history";
import Numbers from "./Numbers/Numbers";

moment.locale("ru");

const history = createBrowserHistory();

class App extends Component {
  public render() {
    return (
      <div className="h-100 d-flex flex-column">
        <Router history={history}>
          <Navbar bg="primary" variant="dark">
            <Container>
              <Navbar.Brand>ВелоКурск тайминг</Navbar.Brand>
              <Nav className="mr-auto">
                <Link to="/races" className="nav-link">
                  Гонки
                </Link>
                <Link to="/numbers" className="nav-link">
                  Номера
                </Link>
              </Nav>
            </Container>
          </Navbar>
          <Route path="/run" component={Timing} />
          <Route path="/races" component={Races} />
          <Route path="/numbers" component={Numbers} />
          <Route path="/" exact={true} render={redirectToRaces} />
        </Router>
      </div>
    );
  }
}
const redirectToRaces = () => <Redirect to="/races" />;

export default App;
