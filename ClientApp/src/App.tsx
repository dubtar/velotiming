import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, Container, Row } from "react-bootstrap";
import Timing from "./timing";
import 'moment/locale/ru';
import moment from 'moment';

moment.locale('ru');

class App extends Component {
  render() {
    return (
      <div className="h-100 d-flex flex-column">
        <Navbar bg="primary" variant="dark">
          <Container>
            <Navbar.Brand >ВелоКурск тайминг</Navbar.Brand>
          </Container>
        </Navbar>
        <Timing />
      </div>
    );
  }
}

export default App;
