import React from 'react';
import { connect } from 'react-redux';
import {BrowserRouter, Route, IndexRoute} from 'react-router-dom';
import Lobby from './Lobby.jsx';
import GameContainer from './GameContainer.jsx';

import {mergeState} from '../../common/actions';
import {Map, fromJS} from 'immutable';

class App extends React.Component {
  componentWillMount(){
    
  }

  render(){
    let extraProps = {
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
    /*this.socket.emit(REQUEST_GAMES, {}, res => {
      let state = {games: res.games};
      this.props.dispatch(mergeState(fromJS(state)));
    });*/
  }

  lobbyInit = (playerName) => {
   /*this.socket.emit(INIT_EVENT_LOBBY, {name: playerName}, res => {
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
      this.props.dispatch(mergeState(fromJS(newState)));
    });*/
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
