import {createActions, handleActions} from 'redux-actions';
import {Map, Record, List} from 'immutable';

//Actions
export const {
  addPlayerToGame, removePlayerFromGame,
  addPointToDrawing, endPathInDrawing,
  sendAddPoint, sendEndPath,
  sendChatMessage, addChatMessage,
  gameStart, correctGuess, outOfTime, intermissionOver,
  leaveGame} = createActions(
  {
    ADD_CHAT_MESSAGE: (name, message) => Map({name, message}),
    CORRECT_GUESS: (guesser, word) => ({guesser, word})
  },
  'SEND_CHAT_MESSAGE',
  'ADD_PLAYER_TO_GAME',
  'REMOVE_PLAYER_FROM_GAME',
  'ADD_POINT_TO_DRAWING', 'SEND_ADD_POINT',
  'END_PATH_IN_DRAWING', 'SEND_END_PATH',
  'GAME_START', 'OUT_OF_TIME', 'INTERMISSION_OVER',
  'LEAVE_GAME'
);

//Selectors
export function getChatMessages(state){
  return state.chatMessages;
}

//Default State
export const GameRecord = Record({
  id: undefined,
  name: '',
  password: undefined,
  maxPlayers: 5,
  currentlyDrawingPlayer: 0,
  players: List(),
  currentWord: '',
  drawingData: Map({paths: List(), curPath: List()}),
  inIntermission: false,
  isStarted: false,
  winner: undefined,
  chatMessages: List()
});

const initialState = new GameRecord();

//Reducers
const reducer = handleActions({
  'JOIN_GAME': (state, action) => {
    return new GameRecord(action.payload);
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
        drawing.update('paths', paths => paths.push(curPath));
        drawing.set('curPath', List());
      });
    });
  },
  [gameStart]: (state, action) => {
    return state.merge({
      isStarted: true,
      inIntermission: false,
      currentWord: action.payload
    });
  },
  [correctGuess]: (state, action) => {
    let s = state.merge({
      inIntermission: true,
      currentWord: action.payload.word
    });
    let drawingPlayer = s.get('currentlyDrawingPlayer');
    s = s.updateIn(['players', action.payload.guesser] , guesser => {
      return guesser.set('score', guesser.get('score') + 3);
    });
    s = s.updateIn(['players', drawingPlayer], drawer => {
      return drawer.set('score', drawer.get('score') + 1);
    });
    let scoreLimit = 10; //TODO: Move to game settings
    let guesserScore = s.players.get(action.payload.guesser).get('score');
    let drawerScore = s.players.get(drawingPlayer).get('score');
    if(guesserScore >= scoreLimit || drawerScore >= scoreLimit){
      if(drawerScore > guesserScore){
        s = s.set('winner', drawingPlayer);
      }else{ //Tie goes to the guesser
        s = s.set('winner', action.payload.guesser);
      }
    }
    return s;
  },
  [outOfTime]: (state, action) => {
    return state.merge({
      inIntermission: true,
      currentWord: action.payload,
    });
  },
  [intermissionOver]: (state, action) => {
    return state.merge({
      inIntermission: false,
      currentlyDrawingPlayer: action.payload
    });
  }
}, initialState);


export default reducer;