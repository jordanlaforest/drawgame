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
import {wsConnect} from './modules/wsConnection';
import rootSaga from './sagas';

const history = createHistory();

const sagaMiddleware = createSagaMiddleware();
const reduxRouterMiddleware = routerMiddleware(history)
const enhancer = composeWithDevTools(applyMiddleware(sagaMiddleware, reduxRouterMiddleware));

const store = createStore(reducer, undefined, enhancer);

sagaMiddleware.run(rootSaga);

store.dispatch(wsConnect()); //Automatically connect to websocket

ReactDOM.render((<Provider store={store}><App history={history}/></Provider>), document.getElementById('view'));