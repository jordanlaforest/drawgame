import React from 'react';
import { connect } from 'react-redux';
import {Router, Route, IndexRoute} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';

import Lobby from './Lobby.jsx';
import GameContainer from './GameContainer.jsx';
import Login from './Login.jsx';

import {isConnected} from '../modules/wsConnection';
import {isLoggedIn, login} from '../modules/auth';

class App extends React.Component {
  render(){
    if(!this.props.connected){
      return (<div><h2>Not Connected to Server</h2></div>);
    }else if(!this.props.loggedIn){
      return <Login submitCB={this.props.submitLogin} />;
    }else{
      return (
        <ConnectedRouter history={this.props.history}>
          <div>
            <Route exact path="/" component={Lobby} />
            <Route path="/game/:gameid" component={GameContainer}/>
          </div>
        </ConnectedRouter>
      )
    }
  }
}

export default connect(state => {
  return {
    connected: isConnected(state.wsConnection),
    loggedIn: isLoggedIn(state.auth)
  };
},
dispatch => {
  return {
    submitLogin: name => dispatch(login(name)),
  };
})(App);
