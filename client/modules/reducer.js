import { Record } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';

import wsConnection from './wsConnection';
import auth from './auth';
import joinGame from './joinGame';
import players from '../../common/modules/players';
import gameList from './gameList';
import game from '../../common/modules/game';

const StateRecord = Record({
  router: undefined,
  auth: undefined,
  joinGame: undefined,
  wsConnection: undefined,
  players: undefined,
  gameList: undefined,
  game: undefined
});

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  auth,
  joinGame,
  wsConnection,
  players,
  gameList,
  game
}, StateRecord);

export default createRootReducer;