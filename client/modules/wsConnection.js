import {createActions, handleActions} from 'redux-actions';
import {Record} from 'immutable';

//Actions
export const {wsConnect, wsConnectSuccess, wsConnectFailure,
              wsDisconnected} = createActions(
  'WS_CONNECT',
  'WS_CONNECT_SUCCESS',
  'WS_CONNECT_FAILURE',
  'WS_DISCONNECTED');

//Selectors
export function isConnected(state){
  return state.connected;
}

//Default State
const StateRecord = Record({
  connected: false,
  connecting: false,
  error: undefined
});

const initialState = new StateRecord();

//Reducers
const reducer = handleActions({
  [wsConnect]: (state) => state.merge({
    connected: false,
    connecting: true,
    error: undefined
  }),
  [wsConnectSuccess]: (state) => state.merge({
    connected: true,
    connecting: false
  }),
  [wsConnectFailure]: (state, action) => state.merge({
    connected: false,
    connecting: false,
    error: action.payload
  }),
  [wsDisconnected]: (state) => state.merge({
    connected: false,
    connecting: false
  })
}, initialState);

export default reducer;