import { Record } from 'immutable';
import { combineReducers } from 'redux-immutable';

import wsConnection from './wsConnection';
import auth from './auth';
import joinGame from './joinGame';
import players from '../../common/modules/players';
import gameList from './gameList';
import game from '../../common/modules/game';

const StateRecord = Record({
  auth: undefined,
  joinGame: undefined,
  wsConnection: undefined,
  players: undefined,
  gameList: undefined,
  game: undefined
});

export default combineReducers({
  auth,
  joinGame,
  wsConnection,
  players,
  gameList,
  game
}, StateRecord);