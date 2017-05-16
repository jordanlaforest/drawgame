import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga'
import {Provider} from 'react-redux';
import {fromJS} from 'immutable';

import App from './components/App.jsx';
import reducer from '../common/reducers/reducers';
import rootSaga from './sagas';

const initialState = {players: {}, games: {}, connected: false};
const sagaMiddleware = createSagaMiddleware();
const enhancer = composeWithDevTools(applyMiddleware(sagaMiddleware));

const store = createStore(reducer, fromJS(initialState), enhancer);

sagaMiddleware.run(rootSaga);

ReactDOM.render((<Provider store={store}><App/></Provider>), document.getElementById('view'));