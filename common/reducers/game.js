import {Map} from 'immutable';
//import * as types from '../ActionTypes';

export function setCurrentWord(state = Map(), newWord){
  return state.set('currentWord', newWord);
}

export function setGameName(state = Map(), newName){
  return state.set('name', newName);
}

export function addPlayerToGame(state = Map(), playerId){
  return state.update('players', (players) => {
    return players.push(Map({
      id: playerId,
      score: 0
    }));
  });
}

export function removePlayerFromGame(state = Map(), playerId){
  return state.update('players', (players) => {
    return players.remove(players.findIndex((player) => {
      return player.get('id') === playerId;
    }));
  });
}

export function addPointToDrawing(state = Map(), point){
  return state.updateIn(['drawingData', 'curPath'], (path) => {
    return path.push(point);
  });
}

export function endPathInDrawing(state = Map()){
  let curPath = state.get('drawingData').get('curPath');
  if(curPath.isEmpty()){
    return state;
  }
  let newState = state.updateIn(['drawingData', 'curPath'], (path) => {
    return path.clear();
  });
  return newState.updateIn(['drawingData', 'paths'], (paths) => {
    return paths.push(curPath);
  });
}

export function setCurrentlyDrawing(state = Map(), playerIndex){
  return state.set('currentlyDrawingPlayer', playerIndex);
}

export function addToScore(state = Map(), playerIndex, amount){
  let oldScore = state.get('players').get(playerIndex).get('score');
  return state.update('players', (players) => {
    return players.update(playerIndex, (player) => {
      return player.set('score', oldScore + amount);
    });
  });
}

export function addChatMessage(state = Map(), message){
  return state.update('chatMessages', chatMessages => chatMessages.push(message));
}

export function gameResetState(state = Map()){
  return state;
}

export function gameNextState(state = Map()){
  return state;
}

/*export function reducer(state = Map(), action){
  switch(action.type){
  case types.SET_CURRENT_WORD:
    return setCurrentWord(state, action.word);
  case types.SET_GAME_NAME:
    return setGameName(state, action.name);
  case types.ADD_PLAYER_TO_GAME:
    return addPlayerToGame(state, action.playerId);
  case types.REMOVE_PLAYER_FROM_GAME:
    return removePlayerFromGame(state, action.playerId);
  case types.ADD_POINT_TO_DRAWING:
    return addPointToDrawing(state, action.point);
  case types.END_PATH_IN_DRAWING:
    return endPathInDrawing(state);
  case types.SET_CURRENTLY_DRAWING:
    return setCurrentlyDrawing(state, action.playerIndex);
  case types.ADD_TO_SCORE:
    return addToScore(state, action.playerIndex, action.amount);
  case types.GAME_RESET_STATE:
    return gameResetState(state);
  case types.GAME_NEXT_STATE:
    return gameNextState(state);
  }
}*/