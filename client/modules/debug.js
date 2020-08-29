import {createActions, handleActions} from 'redux-actions';
import {Record} from 'immutable';

//Actions
export const {toggleDebug} = createActions(
  'TOGGLE_DEBUG');

export function isDebugEnabled(state){
  return state.enabled;
}

//Default State
const StateRecord = Record({
  enabled: false
});

const initialState = new StateRecord();

//Reducers
const reducer = handleActions({
  [toggleDebug]: (state) => state.merge({
    enabled: !state.enabled
  })
}, initialState);

export default reducer;