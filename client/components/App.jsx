import React from 'react';
import Router from 'react-router';
let { RouteHandler } = Router;

import Main from './Main.jsx';
import Game from './Game.jsx';

var App = React.createClass({
  render() {
    return (
      <div>
        <RouteHandler/>
      </div>
    );
  }
});

export default App;
