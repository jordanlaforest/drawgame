import React from 'react';
import { connect } from 'react-redux';
import {Route, Router, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';

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
        <Router history={this.props.history}>
          <div>
            <Switch>
              <Route exact path="/" component={Lobby} />
              <Route path="/game/:gameid" component={GameContainer}/>
            </Switch>
          </div>
        </Router>
      );
    }
  }
}

App.propTypes = {
  connected: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  submitLogin: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

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
