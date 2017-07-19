import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import {Provider} from 'react-redux';

import createHistory from 'history/createBrowserHistory';
import {routerMiddleware} from 'react-router-redux';

import App from './components/App.jsx';
import reducer from './modules/reducer';
import rootSaga from './sagas';

import * as auth from './modules/auth';
import * as gameList from './modules/gameList';
import * as wsConnection from './modules/wsConnection';
import * as game from '../common/modules/game';
import * as players from '../common/modules/players';

const history = createHistory();

const sagaMiddleware = createSagaMiddleware();
const reduxRouterMiddleware = routerMiddleware(history);
const enhancer = composeWithDevTools({
  actionCreators: {
    auth,
    gameList,
    wsConnection,
    game,
    players
  },
  maxAge: 2
});

const store = createStore(reducer, undefined, enhancer(applyMiddleware(sagaMiddleware, reduxRouterMiddleware)));

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
  console.log(dps);
}, 1000);
store.subscribe(() =>{
  dispatches++;
});

ReactDOM.render((<Provider store={store}><App history={history}/></Provider>), document.getElementById('view'));