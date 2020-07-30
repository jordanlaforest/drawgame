import {createActions, handleActions} from 'redux-actions';
import {Record} from 'immutable';

//Actions
export const {joinGame, joinGameSuccess, joinGameFailure} = createActions({
  JOIN_GAME: (gameId) => ({gameId}),
  JOIN_GAME_SUCCESS: (game) => ({game}),
  JOIN_GAME_FAILURE: (error) => ({error})});

//Default State
const StateRecord = Record({
  joiningGame: false,
});

const initialState = new StateRecord();

//Reducers
const reducer = handleActions({
  [joinGame]: (state) => state.merge({
    joiningGame: true
  }),
  [joinGameSuccess]: (state) => state.merge({
    joiningGame: false
  }),
  [joinGameFailure]: (state) => state.merge({
    joiningGame: false,
  })
}, initialState);

export default reducer;