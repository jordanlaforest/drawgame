import React from 'react';
import { Route, DefaultRoute } from 'react-router';

import App from './components/App.jsx';
import Game from './components/Game.jsx';
import GameBrowser from './components/GameBrowser.jsx';
import CreateGame from './components/CreateGame.jsx';

// somehow this is causing the LeaveGame button to be always active...
export var Routes =(
  <Route name="app" path="/" handler={App}>
    <Route name="game" path="/game/:gameid" handler={Game} />
    <Route name="creategame" path="/create" handler={CreateGame} />
    <DefaultRoute handler={GameBrowser} />
  </Route>
);
