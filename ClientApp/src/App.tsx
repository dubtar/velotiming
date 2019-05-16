import React, { Component } from "react";
import { Route, Router, Redirect, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import Timing from "./timing";
import moment from "moment";
import "moment/locale/ru";
import Races from "./Races/Races";
import { createBrowserHistory } from "history";
import Numbers from "./Numbers/Numbers";
import Svc, { RaceInfo } from './svc'
import { Subscription } from "rxjs";

moment.locale("ru");

const history = createBrowserHistory();

const InitialState = {
  race: null as RaceInfo | null
}

class App extends Component<{}, typeof InitialState> {
  private raceSubscription?: Subscription;

  constructor(props: {}) {
    super(props)
    this.state = InitialState
  }

  public componentDidMount() {
    Svc.Connect()
    this.raceSubscription = Svc.Race.subscribe(race => this.setState({ race }))
  }

  public componentWillUnmount() {
    if (this.raceSubscription) this.raceSubscription.unsubscribe()
  }

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
              {this.state.race &&
                <Nav>
                  <Link to="/run" className="btn btn-success">
                    {`${this.state.race.raceName}  ${this.state.race.startName}`}
                  </Link>
                  <Button variant="secondary" onClick={this.deactivate}>Остановить</Button>
                </Nav>}
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
  private deactivate() {
    if (confirm('Остановить текущий заезд?')) Svc.DeactivateStart();
  }
}
const redirectToRaces = () => <Redirect to="/races" />;

export default App;
