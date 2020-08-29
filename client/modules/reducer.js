import { Record } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';

import wsConnection from './wsConnection';
import auth from './auth';
import joinGame from './joinGame';
import players from '../../common/modules/players';
import gameList from './gameList';
import game from '../../common/modules/game';
import debug from './debug';

const StateRecord = Record({
  router: undefined,
  auth: undefined,
  joinGame: undefined,
  wsConnection: undefined,
  players: undefined,
  gameList: undefined,
  game: undefined,
  debug: undefined
});

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  auth,
  joinGame,
  wsConnection,
  players,
  gameList,
  game,
  debug
}, StateRecord);

export default createRootReducer;