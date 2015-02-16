import React from 'react';
import { RouteHandler } from 'react-router';
import NameInput from './NameInput.jsx';

import Grid from 'react-bootstrap/Grid';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import FluxComponent from 'flummox/component';

var App = React.createClass({
  render() {
    return (
      <div className="container-fluid">
        <header className="header">
          <Grid fluid>
            <Row>
              <Col md={10}>
                <h3 className="text-muted">Draw Game</h3>
              </Col>
              <Col md={2}>
                <NameInput />
              </Col>
            </Row>
          </Grid>
        </header>

        <div>

          <FluxComponent connectToStores={['games']}>
            <RouteHandler/>
          </FluxComponent>

        </div>

        <footer className="footer">
          <p>Created by Jordan Laforest and Nicholas Dujay</p>
        </footer>
      </div>
    );
  }
});

export default App;
