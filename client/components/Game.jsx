import React from 'react';
import { IndexLinkContainer } from 'react-router-bootstrap';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

import PlayerList from './PlayerList.jsx';
import GameCanvas from './GameCanvas.jsx';
import Chat from './Chat.jsx';
import DrawingControls from './DrawingControls.jsx';
import Login from './Login.jsx';

import {INIT_EVENT_GAME, JOIN_GAME_EVENT, JOIN_GAME_ERROR} from '../../common/EventConstants';

class Game extends React.Component {
  componentWillMount(){
    let state = {games: {}};
    //Remove games, will be replaced with data from server
    this.props.dispatch(mergeState(fromJS(state)));
  }

  componentDidMount() {
    if(this.props.connected){
      this.props.socket.emit(JOIN_GAME_EVENT, {gameId: this.props.id}, res => {
        if(res.err !== undefined){
          console.log(res.err);
          return;
        }
        let state = {games: {}};
        state.games[this.props.id] = res.game;
        this.props.dispatch(mergeState(fromJS(state)));
      });
    }
  }

  componentWillUnmount(){
    //Leave game event
  }

  addPoint = (point) => {
    this.props.dispatch(addPointToDrawing(this.props.game.get('id'), point));
  }

  endPath = () => {
    this.props.dispatch(endPathInDrawing(this.props.game.get('id')));
  }

  sendChat (message) => {
    let n = 'Bob';
    this.props.dispatch(addChatMessage(this.props.game.get('id'), Map({name: n, message: message})));
  }

  render() {
    if(!this.props.connected){
      return <Login submitCB={this.submitInit} />;
    }else{
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

  submitInit = (data) => {
    if(this.props.socket.connected){
      this.props.socket.emit(INIT_EVENT_GAME, {name: data.name, gameId: this.props.id}, res => {
        if(res.err && res.err !== JOIN_GAME_ERROR){
          console.log(res.err);
          return;
        }
        let state = Map();
        state = state.set('connected', true).set('players', fromJS(res.players));
        if(!res.err){
          let gameId = res.game.id;
          state = state.update('games', () => {
            return Map().set(gameId, fromJS(res.game));
          });
        }
        this.props.dispatch(setState(state));
      });
    }else{
      console.err('Not connected to server');
    }
  }
}
class GameHandler extends React.Component {
  render() {
    let id = this.props.match.params.gameid;
    let game = this.props.games.get(id);
    return (<Game id={id} game={game} socket={this.props.socket}
      allPlayers={this.props.players} connected={this.props.connected}/>);
  }
}

export default GameHandler;
