import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga'
import {Provider} from 'react-redux';
import {fromJS} from 'immutable';

import App from './components/App.jsx';
import reducer from './modules/reducer';
import wsConnect from './modules/wsConnection';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const enhancer = composeWithDevTools(applyMiddleware(sagaMiddleware));

const store = createStore(reducer, undefined, enhancer);

sagaMiddleware.run(rootSaga);

store.dispatch(wsConnect()); //Automatically connect to websocket

ReactDOM.render((<Provider store={store}><App/></Provider>), document.getElementById('view'));