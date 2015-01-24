import React from 'react';
import Router from 'react-router';
let { Route, DefaultRoute, RouteHandler } = Router;

import Main from './Main.jsx';
import Game from './Game.jsx';

var App = React.createClass({
  render() {
    return ( <RouteHandler/> );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="game" path="/game/:gameId" handler={Game} />
    <DefaultRoute handler={Main} />
  </Route>
);

Router.run(routes, (Handler) => React.render(<Handler/>, document.getElementById('view')));

export default App;
