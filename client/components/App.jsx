import React from 'react';
import { RouteHandler } from 'react-router';
import NameInput from './NameInput.jsx';

import { Grid, Row, Col } from 'react-bootstrap';

import FluxComponent from 'flummox/component';

var App = React.createClass({
  render() {
    return (
      /*eslint-disable no-undef */
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
      /*eslint-enable no-undef */
    );
  }
});

export default App;
