import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, IndexRoute} from 'react-router-dom';

import App from './components/App.jsx';
import GameHandler from './components/Game.jsx';
import Lobby from './components/Lobby.jsx';

ReactDOM.render((
  <BrowserRouter>
    <Route path="/" component={App}>
      <IndexRoute component={Lobby} />
      <Route path="/game/:gameid" component={GameHandler} />
    </Route>
  </BrowserRouter>
), document.getElementById('view'));