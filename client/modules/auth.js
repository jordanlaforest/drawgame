import {createActions, handleActions} from 'redux-actions';
import {Record} from 'immutable';

//Actions
export const {login, loginSuccess, loginFailure} = createActions({
  LOGIN: (name) => ({name}),
  LOGIN_SUCCESS: (playerId, players, gameList) => ({playerId, players, gameList})},
  'LOGIN_FAILURE');

export function isLoggedIn(state){
  return state.playerId !== undefined;
}

export function getPlayerId(state){
  return state.playerId;
}

//Default State
const StateRecord = Record({
  loggingIn: false,
  playerId: undefined,
  error: undefined
});

const initialState = new StateRecord();

//Reducers
const reducer = handleActions({
  [login]: (state) => state.merge({
    loggingIn: true
  }),
  [loginSuccess]: (state, action) => state.merge({
    playerId: action.payload.playerId,
    loggingIn: false
  }),
  [loginFailure]: (state, action) => state.merge({
    playerId: undefined,
    loggingIn: false,
    error: action.payload
  })
}, initialState);

export default reducer;