import {createActions, handleActions} from 'redux-actions';
import {Map, Record, List} from 'immutable';

//Actions
export const {
  addPlayerToGame, removePlayerFromGame,
  addPointToDrawing, endPathInDrawing,
  sendAddPoint, sendEndPath,
  sendChatMessage, addChatMessage, addServerMessage,
  gameStart, correctGuess, outOfTime, intermissionOver, timerTick,
  leaveGame} = createActions(
  {
    ADD_CHAT_MESSAGE: (name, message) => Map({name, message}),
    CORRECT_GUESS: (guesser, timer, word) => ({guesser, word, timer}),
    GAME_START: (timer, newWord='') => ({timer, newWord}),
    OUT_OF_TIME: (timer, word) => ({timer, word}),
    INTERMISSION_OVER: (timer) => ({timer})
  },
  'ADD_SERVER_MESSAGE',
  'SEND_CHAT_MESSAGE',
  'ADD_PLAYER_TO_GAME',
  'REMOVE_PLAYER_FROM_GAME',
  'ADD_POINT_TO_DRAWING', 'SEND_ADD_POINT',
  'END_PATH_IN_DRAWING', 'SEND_END_PATH',
  'TIMER_TICK',
  'LEAVE_GAME'
);

//Selectors
export function getChatMessages(state){
  return state.chatMessages;
}

export function getTimerSeconds(state){
  return state.timer;
}

//Default State
export const GameRecord = Record({
  id: undefined,
  name: '',
  password: '',
  maxPlayers: 5,
  currentlyDrawingPlayer: 0,
  players: List(),
  currentWord: '',
  drawingData: Map({paths: List(), curPath: List()}),
  inIntermission: false,
  isStarted: false,
  winner: undefined,
  chatMessages: List(),
  timer: 0
});

const initialState = new GameRecord();

export function createGame (id, name){
  return initialState.set('id', id).set('name', name);
}

//Reducers
const reducer = handleActions({
  'JOIN_GAME_SUCCESS': (state, action) => {
    return new GameRecord(action.payload.game);
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
  [addServerMessage]: (state, action) => {
    return state.update('chatMessages', chat => chat.push(Map({message: action.payload})));
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
      winner: undefined,
      currentlyDrawingPlayer: 0,
      currentWord: action.payload.newWord,
      timer: action.payload.timer,
      players: state.players.map(p => Map({id: p.get('id'), score: 0}))
    });
  },
  [correctGuess]: (state, action) => {
    return state.withMutations(s => {
      s.set('inIntermission', true);
      if(action.payload.word !== undefined){ //Will be undefined when applying action to server state
        s.set('currentWord', action.payload.word);
      }

      let drawingPlayer = s.get('currentlyDrawingPlayer');
      s.update('players', playerList => {
        return playerList.withMutations(pList => {
          pList.update(action.payload.guesser, guesser => {
            return guesser.set('score', guesser.get('score') + 3); //TODO: Move scoring values to some config
          });
          pList.update(drawingPlayer, drawer => {
            return drawer.set('score', drawer.get('score') + 1);
          });
        });
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
      }else{
        s = s.set('timer', action.payload.timer);
      }
    });
  },
  [outOfTime]: (state, action) => {
    return state.merge({
      inIntermission: true,
      currentWord: action.payload.word,
      timer:action.payload.timer
    });
  },
  [intermissionOver]: (state, action) => {
    return state.merge({
      inIntermission: false,
      currentlyDrawingPlayer: (state.currentlyDrawingPlayer + 1) % state.players.size,
      timer: action.payload.timer
    });
  },
  [timerTick]: (state) => {
    return state.merge({
      timer: state.timer - 1
    });
  }
}, initialState);


export default reducer;