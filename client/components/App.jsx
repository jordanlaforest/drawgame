import React from 'react';
import { connect } from 'react-redux';
import {BrowserRouter, Route, IndexRoute} from 'react-router-dom';
import io from 'socket.io-client';
import Lobby from './Lobby.jsx';
import GameHandler from './Game.jsx';

import {ACTION, INIT_EVENT_LOBBY, REQUEST_GAMES} from '../../common/EventConstants';
import {Map, fromJS} from 'immutable';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {players: Map(), games: Map(), connected: false, thisPlayerId: undefined};
  }
  componentWillMount(){
    this.socket = io('http://localhost:9000'); //TODO: Inject port

    //Allow the server to dispatch any actions
    this.socket.on(ACTION, actions => {
      actions.forEach(action => {
        this.props.dispatch(action);
      });
    });
  }

  render(){
    let extraProps = {
          socket: this.socket,
          players: this.state.players,
          games: this.state.games,
          connected: this.state.connected,
          thisPlayer: this.state.thisPlayer,
          callbacks: {
            requestGames: this.requestGames,
            lobbyInit: this.lobbyInit
          }
        };
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" render={routeProps => <Lobby {...routeProps} {...extraProps}/>} />
          <Route path="/game/:gameid" render={routeProps => <GameHandler {...routeProps} {...extraProps}/>} />
        </div>
      </BrowserRouter>
    )
  }

  requestGames = () => {
    console.log('Requesting list of games');
    this.socket.emit(REQUEST_GAMES, {}, res => {
      let state = {games: fromJS(res.games)};
      this.setState(state);
    });
  }

  lobbyInit = (playerName) => {
   this.socket.emit(INIT_EVENT_LOBBY, {name: playerName}, res => {
      if(res.err){
        console.log(res.err);
        return;
      }
      let newState = {
        connected: true,
        thisPlayerId: res.id,
        players: fromJS(res.players),
        games: fromJS(res.games)
      };
      this.setState(newState);
    });
  }
}

export default App;
