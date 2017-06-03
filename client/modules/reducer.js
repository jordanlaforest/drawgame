import { Record } from 'immutable';
import { combineReducers } from 'redux-immutable';
//import { routerReducer } from 'react-router-redux'; //TODO

import wsConnection from './wsConnection';
import auth from './auth';
//import players from '../../common/modules/players';
import gameList from './gameList';
//import game from '../../common/modules/game';

const StateRecord = Record({
  //routing: routerReducer,
  auth: undefined,
  wsConnection: undefined,
  //players: undefined,
  gameList: undefined
  //game: undefined
});

export default combineReducers({
  //routing: routerReducer,
  auth,
  wsConnection,
  //players,
  gameList
  //game
}, StateRecord);