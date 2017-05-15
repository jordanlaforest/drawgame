import React from 'react';
import { connect } from 'react-redux';
import {BrowserRouter, Route, IndexRoute} from 'react-router-dom';
import io from 'socket.io-client';
import Lobby from './Lobby.jsx';
import GameContainer from './GameContainer.jsx';

import {ACTION, INIT_EVENT_LOBBY, REQUEST_GAMES} from '../../common/EventConstants';
import {mergeState} from '../../common/actions';
import {Map, fromJS} from 'immutable';

class App extends React.Component {
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
          thisPlayer: this.props.thisPlayer,
          callbacks: {
            requestGames: this.requestGames,
            lobbyInit: this.lobbyInit
          }
        };
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" render={routeProps => <Lobby {...routeProps} {...extraProps}/>} />
          <Route path="/game/:gameid" render={routeProps => <GameContainer {...routeProps} {...extraProps}/>} />
        </div>
      </BrowserRouter>
    )
  }

  requestGames = () => {
    console.log('Requesting list of games');
    this.socket.emit(REQUEST_GAMES, {}, res => {
      let state = {games: res.games};
      this.props.dispatch(mergeState(fromJS(state)));
    });
  }

  lobbyInit = (playerName) => {
   this.socket.emit(INIT_EVENT_LOBBY, {name: playerName}, res => {
      if(res.err){
        console.log(res.err);
        return;
      }
      console.log(res.games);
      console.log(fromJS(res.games));
      let newState = {
        connected: true,
        thisPlayerId: res.id,
        players: fromJS(res.players),
        games: fromJS(res.games)
      };
      this.props.dispatch(mergeState(fromJS(newState)));
    });
  }
}

export default connect((state) => {
  return {
    connected: state.get('connected'),
    thisPlayer: state.get('thisPlayerId'),
    players: state.get('players'),
    games: state.get('games')
  };
})(App);
