// other stuff
import React from 'react';
import { State } from 'react-router';
import { ButtonLink } from 'react-router-bootstrap';

// react-bootstrap
import Grid from 'react-bootstrap/Grid';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// app components
import PlayerList from './PlayerList.jsx';
import GameCanvas from './GameCanvas.jsx';
import Chat from './Chat.jsx';
import DrawingControls from './DrawingControls.jsx';

import FluxComponent from 'flummox/component';

var Game = React.createClass({
  mixins: [ State ],

  componentWillMount() {
    this.gameActions = this.props.flux.getActions('games');
    this.gameActions.getGameInfo(this.getParams().gameid);
  },

  componentWillUnmount() {
    // TODO change
    this.props.flux.getStore('players').unloadPlayers();
  },

  render() {
    return (
      <div>

        <ButtonLink to="app">Leave Game</ButtonLink>
        <Button> Skip Word </Button>

        <Grid fluid>
          <Row>

            <Col md={2}>
              <Row>
                {/* all state from games and players get passed as props on PlayerList */}
                <FluxComponent connectToStores={['players', 'games']}>
                  <PlayerList />
                </FluxComponent>
              </Row>

              <Row>
                <DrawingControls />
              </Row>

            </Col>

            <Col md={8}>
              {/* all state from games and players get passed as props on GameCanvas */}
              <FluxComponent connectToStores={['games', 'players', 'drawing']} >
                <GameCanvas />
              </FluxComponent>
            </Col>

            <Col md={2}>
              {/* All state from messages and players gets passed as properties on chat */}
              <FluxComponent connectToStores={['messages', 'players']}>
                <Chat />
              </FluxComponent>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Game;
