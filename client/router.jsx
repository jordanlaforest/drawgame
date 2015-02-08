import React from 'react';
import Router from 'react-router';
let { Route, DefaultRoute, HistoryLocation } = Router;

import App from './components/App.jsx';
import Game from './components/Game.jsx';
import GameBrowser from './components/GameBrowser.jsx';
import CreateGame from './components/CreateGame.jsx';
import EditPlayer from './components/EditPlayer.jsx';

// somehow this is causing the LeaveGame button to be always active...
var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="game" path="/game/:gameid" handler={Game} />
    <Route name="creategame" path="/create" handler={CreateGame} />
    <Route name="editplayer" path="/edit" handler={EditPlayer} />
    <DefaultRoute handler={GameBrowser} />
  </Route>
);

Router.run(routes, (Handler) => React.render(<Handler />, document.body));
