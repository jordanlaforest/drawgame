import {createActions, handleActions} from 'redux-actions';
import {Map, Record, List} from 'immutable';

//Actions
export const {
  addPlayerToGame, removePlayerFromGame, addPointToDrawing,
  endPathInDrawing, sendChatMessage, addChatMessage, leaveGame} = createActions({
    ADD_CHAT_MESSAGE: (name, message) => Map({name, message})
  },
  'SEND_CHAT_MESSAGE',
  'ADD_PLAYER_TO_GAME',
  'REMOVE_PLAYER_FROM_GAME',
  'ADD_POINT_TO_DRAWING',
  'END_PATH_IN_DRAWING',
  'LEAVE_GAME'
);

//Selectors
export function getChatMessages(state){
  return state.chatMessages;
}

//Default State
const GameRecord = Record({
  id: undefined,
  name: '',
  password: undefined,
  maxPlayers: 5,
  currentlyDrawingPlayer: 0,
  players: List(),
  currentWord: '',
  drawingData: Map({paths: List(), curPath: List()}),
  inIntermission: false,
  chatMessages: List()
});

const initialState = new GameRecord();

//Reducers
const reducer = handleActions({
  'JOIN_GAME': (state, action) => {
    return action.payload;
  },
  [addPlayerToGame]: (state, action) => {
    return state.update('players', (players) => {
      return players.push(Map({
        id: action.payload,
        score: 0
      }));
    });
  },
  [removePlayerFromGame]: (state, action) => {
    return state.update('players', (players) => {
      return players.remove(players.indexOf(action.payload));
    });
  },
  [addChatMessage]: (state, action) => {
    return state.update('chatMessages', chat => chat.push(action.payload));
  },
  [addPointToDrawing]: (state, action) => {
    return state.updateIn(['drawingData', 'curPath'], path => path.push(action.payload));
  },
  [endPathInDrawing]: (state) => {
    return state.update('drawingData', drawingData => {
      let curPath = drawingData.get('curPath');
      if(curPath.isEmpty()){
        return drawingData;
      }
      return drawingData.withMutations(drawing => {
        drawing.get('paths').push(curPath);
        drawing.get('curPath').clear();
      });
    });
  }
}, initialState);


export default reducer;