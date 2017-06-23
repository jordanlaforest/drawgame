import {createActions, handleActions} from 'redux-actions';
import {Record, List} from 'immutable';
import {loginSuccess} from './auth';

//Actions
export const {refreshGames, refreshGamesSuccess, refreshGamesFailure} = createActions(
  'REFRESH_GAMES',
  'REFRESH_GAMES_SUCCESS',
  'REFRESH_GAMES_FAILURE'
);

//Selectors
export function getGameList(state){
  return state.games;
}

//Default State
const StateRecord = Record({
  games: List(),
  refreshing: false,
  error: undefined
});

const initialState = new StateRecord();

//Reducers
const reducer = handleActions({
  [refreshGames]: (state, action) => state.merge({
    refreshing: true,
    error: undefined
  }),
  [refreshGamesSuccess]: (state, action) => state.merge({
    refreshing: false,
    games: action.payload
  }),
  [refreshGamesFailure]: (state, action) => state.merge({
    refreshing: false,
    error: action.payload
  }),
  [loginSuccess]: (state, action) => {
    if(action.payload.gameList !== undefined){
      return state.merge({games: action.payload.gameList});
    }else{
      return state;
    }
  }
}, initialState);

export default reducer;