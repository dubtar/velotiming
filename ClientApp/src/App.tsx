import React, { Component } from 'react'
import { Route, Router, Redirect } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'
import { Navbar, Container, Nav } from 'react-bootstrap'
import Timing from './timing'
import moment from 'moment'
import 'moment/locale/ru'
import Races from './Races/Races'
import { createBrowserHistory } from 'history'
import Numbers from './Numbers/Numbers'

moment.locale('ru');

const history = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <div className="h-100 d-flex flex-column">
        <Navbar bg="primary" variant="dark">
          <Container>
            <Navbar.Brand >ВелоКурск тайминг</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link href="/races">Гонки</Nav.Link>
              <Nav.Link href="/numbers">Номера</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Router history={history}>
            <Route path="/run" component={Timing} />
            <Route path="/races" component={Races} />
            <Route path="/numbers" component={Numbers} />
            <Route path="/" exact={true} render={(props) => <Redirect to="/races" />}/>
        </Router>
      </div>
    );
  }
}

export default App;
