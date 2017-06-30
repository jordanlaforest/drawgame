import {createActions, handleActions} from 'redux-actions';
import {Map} from 'immutable';

import {loginSuccess} from '../../client/modules/auth';

//Actions
export const {addPlayer, removePlayer} = createActions(
  'ADD_PLAYER',
  'REMOVE_PLAYER'
);

const initialState = Map();

const reducer = handleActions({
  [loginSuccess]: (state, action) => {
    if(action.payload.players !== undefined){
      return action.payload.players;
    }else{
      return state;
    }
  },
  [addPlayer]: (state, action) => {
    return state.set(action.payload.get('id'), action.payload);
  },
  [removePlayer]: (state, action) => {
    return state.delete(action.payload);
  }
}, initialState);

export default reducer;