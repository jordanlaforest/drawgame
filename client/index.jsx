import React from 'react';
window.React = React;
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {fromJS} from 'immutable';

import App from './components/App.jsx';
import reducer from '../common/reducers/reducers';

const initialState = {players: {}, games: {}, connected: false};
const store = createStore(reducer, fromJS(initialState), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
window.store = store;

ReactDOM.render((<Provider store={store}><App/></Provider>), document.getElementById('view'));