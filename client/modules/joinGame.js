import {createActions, handleActions} from 'redux-actions';
import {Record} from 'immutable';

//Actions
export const {joinGame, joinGameSuccess, joinGameFailure} = createActions({
  JOIN_GAME: (gameId) => ({gameId}),
  JOIN_GAME_SUCCESS: (game) => ({game}),
  JOIN_GAME_FAILURE: (error) => ({error})});

//Selectors
export function getJoiningGameId(state){
  return state.joiningGameId;
}

//Default State
const StateRecord = Record({
  joiningGameId: undefined
});

const initialState = new StateRecord();

//Reducers
const reducer = handleActions({
  [joinGame]: (state, action) => state.merge({
    joiningGameId: action.payload.gameId
  }),
  [joinGameSuccess]: (state) => state.merge({
    joiningGameId: undefined
  }),
  [joinGameFailure]: (state) => state.merge({
    joiningGameId: undefined
  })
}, initialState);

export default reducer;