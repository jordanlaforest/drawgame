import React from 'react';
import {Map, fromJS} from 'immutable';
import { connect } from 'react-redux';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

import PlayerList from './PlayerList.jsx';
import GameCanvas from './GameCanvas.jsx';
import Chat from './Chat.jsx';
import DrawingControls from './DrawingControls.jsx';

import {sendAddPoint, sendEndPath, sendChatMessage, leaveGame} from '../../common/modules/game';

class GameContainer extends React.Component {
  render() {
    let game = this.props.game;
    if(game.get('id') === undefined){
      return <div>Loading</div>;
    }
    let paths = game.get('drawingData').get('paths').push(game.get('drawingData').get('curPath'));
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
                  allPlayers={this.props.allPlayers}/>
              </Row>
              <Row>
                <DrawingControls />
              </Row>
            </Col>
            <Col md={8}>
              <GameCanvas thisPlayer={0}
                currentlyDrawing={game.get('currentlyDrawingPlayer')}
                currentWord={game.get('currentWord')}
                gamePlayers={game.get('players')}
                allPlayers={this.props.allPlayers}
                canvasSize={Map({w:800, h:600})}
                paths={paths}
                addPointCB={this.props.addPoint}
                endPathCB={this.props.endPath}
                />
            </Col>
            <Col md={2}> <Chat messages={chatMessages} sendChatCB={this.props.sendChat} /> </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default connect(
  state => {
    return {
      allPlayers: state.players,
      game: state.game
    };
  },
  dispatch => {
    return {
      addPoint: point => dispatch(sendAddPoint(fromJS(point))),
      endPath: () => dispatch(sendEndPath()),
      sendChat: message => dispatch(sendChatMessage(message)),
      leaveGame: () => dispatch(leaveGame())
    };
  }
)(GameContainer);
