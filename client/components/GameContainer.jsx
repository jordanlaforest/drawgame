import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {Map} from 'immutable';
import {connect} from 'react-redux';

import Button from 'react-bootstrap/lib/Button';
import './styles/gameContainer.css';

import PlayerList from './PlayerList.jsx';
import GameCanvasContainer from './GameCanvasContainer.jsx';
import Chat from './Chat.jsx';
import DrawingControls from './DrawingControls.jsx';

import {GameRecord, sendChatMessage, leaveGame} from '../../common/modules/game';
import { joinGame } from '../modules/joinGame.js';
import Prompt from './Prompt.jsx';

class GameContainer extends React.Component {
  render() {
    let game = this.props.game;
    if(game.get('id') === undefined){
      if(this.props.thisPlayerId){
        return <Prompt title="Enter game password" submitCB={this.props.submitPassword} />;
      }
      return <div>Loading</div>;
    }
    let chatMessages = game.get('chatMessages');
    return (
      <Fragment>
        <nav>
          <Button onClick={this.props.leaveGame}>Leave Game</Button>
          <Button>Skip Word</Button>
        </nav>
        <div className="gameContainer">
          <div className="gameSidebar">
            <PlayerList currentlyDrawing={game.get('currentlyDrawingPlayer')}
              gamePlayers={game.get('players')}
              allPlayers={this.props.allPlayers}
              thisPlayerId={this.props.thisPlayerId} />
            <DrawingControls />
          </div>
          <div className="canvasPanel">
            <GameCanvasContainer/>
          </div>
          <div className="gameSidebar">
            <Chat messages={chatMessages} sendChatCB={this.props.sendChat} />
          </div>
        </div>
      </Fragment>
    );
  }
}

GameContainer.propTypes = {
  game: PropTypes.instanceOf(GameRecord).isRequired,
  leaveGame: PropTypes.func.isRequired,
  thisPlayerId: PropTypes.string.isRequired,
  allPlayers: PropTypes.instanceOf(Map).isRequired,
  sendChat: PropTypes.func.isRequired,
  submitPassword: PropTypes.func.isRequired
};

export default connect(
  state => {
    return {
      allPlayers: state.players,
      game: state.game,
      thisPlayerId: state.auth.get('playerId')
    };
  },
  (dispatch, ownProps) => {
    return {
      sendChat: message => dispatch(sendChatMessage(message)),
      leaveGame: () => dispatch(leaveGame()),
      submitPassword: password => dispatch(joinGame(ownProps.match.params.gameid, password))
    };
  }
)(GameContainer);
