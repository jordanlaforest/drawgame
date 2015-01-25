import React from 'react';
import Marty from 'marty';
import { State } from 'react-router';
import { ButtonLink } from 'react-router-bootstrap';

import Grid from 'react-bootstrap/Grid';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import PlayerList from './PlayerList.jsx';
import GameCanvas from './GameCanvas.jsx';
import Chat from './Chat.jsx';

import GameStore from '../stores/GameStore';
import PlayersStore from '../stores/PlayersStore';

import GameActionsCreators from '../actions/GameActionCreators';

import MessagesSource from '../sources/MessagesSource';
import DrawingSource from '../sources/DrawingSource';

GameActionsCreators.initGame();

var GameState = Marty.createStateMixin({
  listenTo: [GameStore, PlayersStore],
  getState() {
    let { currentWord } = GameStore.state;
    let { players, player } = PlayersStore.state;
    return {
      currentWord,
      drawingPlayer: GameStore.getDrawingPlayer(),
      players,
      player
    };
  }
});

var Game = React.createClass({
  mixins: [ State, GameState ],
  componentWillMount() {
    MessagesSource.open();
    DrawingSource.open();
  },
  componentWillUnmount() {
    MessagesSource.close();
    DrawingSource.close();
  },
  render() {
    return (
      <div>
        <ButtonLink to="app">Leave Game</ButtonLink>
        <Grid fluid>
          <Row>
            <Col md={2}> <PlayerList players={this.state.players} isDrawing={GameStore.isDrawing.bind(GameStore)} /> </Col>
            <Col md={8}>
              <GameCanvas amIDrawing={GameStore.amIDrawing()} currentWord={this.state.currentWord} username={this.state.drawingPlayer.username} />
            </Col>
            <Col md={2}> <Chat /> </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Game;
