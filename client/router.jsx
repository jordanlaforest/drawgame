import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute} from 'react-router';
import {Provider} from 'react-redux';

import App from './components/App.jsx';
import GameHandler from './components/Game.jsx';
import Lobby from './components/Lobby.jsx';

import makeStore from './store';

const store = makeStore();
window.store = store;

ReactDOM.render((
  <Provider store={store}>
    <Router>
      <Route path="/" component={App}>
        <IndexRoute component={Lobby} />
        <Route path="/game/:gameid" component={GameHandler} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('view'));