import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import {cSetConnected} from '../../common/actions';

var App = React.createClass({
  componentWillMount(){
    this.props.dispatch(cSetConnected(false));
    this.socket = io('http://localhost:9000');
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
