import '@babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import {Provider} from 'react-redux';

import Immutable from 'immutable';

import {createBrowserHistory} from 'history';
import {routerMiddleware} from 'connected-react-router/immutable';

import App from './components/App.jsx';
import createRootReducer from './modules/reducer';
import rootSaga from './sagas';

import * as auth from './modules/auth';
import * as gameList from './modules/gameList';
import * as joinGame from './modules/joinGame';
import * as wsConnection from './modules/wsConnection';
import * as debug from './modules/debug';
import * as game from '../common/modules/game';
import * as players from '../common/modules/players';

const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();
const enhancer = composeWithDevTools({
  actionCreators: {
    auth,
    gameList,
    joinGame,
    wsConnection,
    game,
    players,
    debug
  },
  serialize: {
    immutable: Immutable,
    refs: [game.GameRecord]
  },
  maxAge: 30
});

const store = createStore(createRootReducer(history), undefined, enhancer(applyMiddleware(sagaMiddleware, routerMiddleware(history))));

sagaMiddleware.run(rootSaga);

store.dispatch(wsConnection.wsConnect()); //Automatically connect to websocket

//Calculate dispatches per second
var dispatches = 0;
var time = new Date().getTime();
setInterval(() => {
  var now = new Date().getTime();
  var dps = dispatches/(now-time) * 1000;
  time = now;
  dispatches = 0;
  console.log('Dispatches/sec: ' + dps);
}, 1000);
store.subscribe(() =>{
  dispatches++;
});

ReactDOM.render((<Provider store={store}><App history={history}/></Provider>), document.getElementById('view'));