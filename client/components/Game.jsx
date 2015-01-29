import React from 'react';
import Marty from 'marty';
import { State } from 'react-router';
import { ButtonLink } from 'react-router-bootstrap';

import Grid from 'react-bootstrap/Grid';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import PlayerList from './PlayerList.jsx';
import GameCanvas from './GameCanvas.jsx';
import Chat from './Chat.jsx';
import DrawingControls from './DrawingControls.jsx';

import GameStore from '../stores/GameStore';
import PlayersStore from '../stores/PlayersStore';

import MessagesSource from '../sources/MessagesSource';
import DrawingSource from '../sources/DrawingSource';

import GameAPI from '../sources/GameAPI';

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
    GameAPI.loadGame(this.getParams().gameid);
  },
  componentWillUnmount() {
    PlayersStore.unloadPlayers();
    MessagesSource.close();
    DrawingSource.close();
  },
  render() {
    let { players, currentWord, drawingPlayer: { name }}  = this.state;
    return (
      <div>
        <ButtonLink to="app">Leave Game</ButtonLink>
        <Button> Skip Word </Button>
        <Grid fluid>
          <Row>
            <Col md={2}>
              <Row>
                <PlayerList players={players} isDrawing={GameStore.isDrawing.bind(GameStore)} />
              </Row>
              <Row>
                <DrawingControls />
              </Row>
            </Col>
            <Col md={8}>
              <GameCanvas amIDrawing={GameStore.amIDrawing()} currentWord={currentWord} name={name} />
            </Col>
            <Col md={2}> <Chat /> </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Game;
