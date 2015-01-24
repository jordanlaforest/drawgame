import React from 'react';
import { State } from 'react-router';

import Grid from 'react-bootstrap/Grid';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import PlayerList from './PlayerList.jsx';
import Canvas from './Canvas.jsx';
import Chat from './Chat.jsx';

var Game = React.createClass({
  mixins: [State],
  render() {
    return (
      <Grid fluid>
        <Row>
          <Col md={2}> <PlayerList players={[]} /> </Col>
          <Col md={8}> <Canvas playerId={'me'} currentWord={'Dog'} /> </Col>
          <Col md={2}> <Chat messages={[]} /> </Col>
        </Row>
      </Grid>
    );
  }
});

export default Game;
