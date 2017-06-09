import React from 'react';
import {Map, fromJS} from 'immutable';
import { connect } from 'react-redux';
import { IndexLinkContainer } from 'react-router-bootstrap';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

import PlayerList from './PlayerList.jsx';
import GameCanvas from './GameCanvas.jsx';
import Chat from './Chat.jsx';
import DrawingControls from './DrawingControls.jsx';

import {addPointToDrawing, endPathInDrawing, addChatMessage} from '../../common/actions';
import {INIT_EVENT_GAME, JOIN_GAME_EVENT, JOIN_GAME_ERROR} from '../../common/EventConstants';

class GameContainer extends React.Component {
  componentDidMount() {
    if(this.props.connected){
      this.props.socket.emit(JOIN_GAME_EVENT, {gameId: this.props.game.get('id')}, res => {
        if(res.err !== undefined){
          console.log(res.err);
          return;
        }
        let state = {games: {}};
        state.games[this.props.game.get('id')] = res.game;
        //this.props.dispatch(mergeState(fromJS(state)));
      });
    }
  }

  addPoint = (point) => {
    this.props.dispatch(addPointToDrawing(this.props.game.get('id'), point));
  }

  endPath = () => {
    this.props.dispatch(endPathInDrawing(this.props.game.get('id')));
  }

  sendChat = (message) => {
    let n = 'Bob';
    this.props.dispatch(addChatMessage(this.props.game.get('id'), Map({name: n, message: message})));
  }

  render() {
    let game = this.props.game;
    if(game === undefined){
      return <div>Loading</div>;
    }
    let paths = game.get('drawingData').get('paths').push(game.get('drawingData').get('curPath'));
    let chatMessages = game.get('chatMessages');
    return (
      <div>
        <IndexLinkContainer to="/"><Button>Leave Game</Button></IndexLinkContainer>
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
                addPointCB={this.addPoint}
                endPathCB={this.endPath}
                />
            </Col>
            <Col md={2}> <Chat messages={chatMessages} sendChatCB={this.sendChat} /> </Col>
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
      addPoint: point => dispatch(addPointToDrawing(point)),
      endPath: () => dispatch(endPathInDrawing()),
      sendChat: message => dispatch(addChatMessage(message))
    };
  }
)(GameContainer);
