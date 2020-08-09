import React from 'react';
import PropTypes from 'prop-types';
import {Map} from 'immutable';
import {connect} from 'react-redux';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

import PlayerList from './PlayerList.jsx';
import GameCanvasContainer from './GameCanvasContainer.jsx';
import Chat from './Chat.jsx';
import DrawingControls from './DrawingControls.jsx';

import {GameRecord, sendChatMessage, leaveGame} from '../../common/modules/game';

class GameContainer extends React.Component {
  render() {
    let game = this.props.game;
    if(game.get('id') === undefined){
      return <div>Loading</div>;
    }
    let chatMessages = game.get('chatMessages');
    return (
      <div>
        <Button onClick={this.props.leaveGame}>Leave Game</Button>
        <Button>Skip Word</Button>
        <Grid fluid>
          <Row>
            <Col md={2}>
              <Row>
                <PlayerList currentlyDrawing={game.get('currentlyDrawingPlayer')}
                  gamePlayers={game.get('players')}
                  allPlayers={this.props.allPlayers}
                  thisPlayerId={this.props.thisPlayerId} />
              </Row>
              <Row>
                <DrawingControls />
              </Row>
            </Col>
            <Col md={8}>
              <GameCanvasContainer/>
            </Col>
            <Col md={2}> <Chat messages={chatMessages} sendChatCB={this.props.sendChat} /> </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

GameContainer.propTypes = {
  game: PropTypes.instanceOf(GameRecord).isRequired,
  leaveGame: PropTypes.func.isRequired,
  thisPlayerId: PropTypes.string.isRequired,
  allPlayers: PropTypes.instanceOf(Map).isRequired,
  sendChat: PropTypes.func.isRequired
};

export default connect(
  state => {
    return {
      allPlayers: state.players,
      game: state.game,
      thisPlayerId: state.auth.get('playerId')
    };
  },
  dispatch => {
    return {
      sendChat: message => dispatch(sendChatMessage(message)),
      leaveGame: () => dispatch(leaveGame())
    };
  }
)(GameContainer);
