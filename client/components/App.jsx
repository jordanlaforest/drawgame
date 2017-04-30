import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import {cSetConnected} from '../../common/actions';
import {ACTION} from '../../common/EventConstants';

var App = React.createClass({
  componentWillMount(){
    this.props.dispatch(cSetConnected(false));
    this.socket = io('http://localhost:9000');

    //Allow the server to dispatch any actions
    this.socket.on(ACTION, actions => {
      actions.forEach(action => {
        this.props.dispatch(action);
      });
    });
  },
  render() {
    return (
      <div>
        {React.cloneElement(this.props.children, {socket: this.socket})}
      </div>
    );
  }
});

export default connect()(App);
