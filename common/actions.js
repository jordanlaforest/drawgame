import * as types from './ActionTypes';

export function setState(state){
  return {
    type: types.SET_STATE,
    state: state
  };
}

export function mergeState(state){
  return {
    type: types.MERGE_STATE,
    state: state
  };
}

export function setCurrentWord(gameId, word){
  return {
    type: types.SET_CURRENT_WORD,
    gameId: gameId,
    word: word
  };
}

export function setGameName(gameId, name){
  return {
    type: types.SET_GAME_NAME,
    gameId: gameId,
    name: name
  };
}

export function addPlayerToGame(gameId, playerId){
  return {
    type: types.ADD_PLAYER_TO_GAME,
    gameId: gameId,
    playerId: playerId
  };
}

export function removePlayerFromGame(gameId, playerId){
  return {
    type: types.REMOVE_PLAYER_FROM_GAME,
    gameId: gameId,
    playerId: playerId
  };
}

export function addPointToDrawing(gameId, point){
  return {
    type: types.ADD_POINT_TO_DRAWING,
    gameId: gameId,
    point: point
  };
}

export function endPathInDrawing(gameId){
  return {
    type: types.END_PATH_IN_DRAWING,
    gameId: gameId
  };
}

export function setCurrentlyDrawing(gameId, playerIndex){
  return {
    type: types.SET_CURRENTLY_DRAWING,
    gameId: gameId,
    playerIndex: playerIndex
  };
}

export function addToScore(playerIndex, amount){
  return {
    type: types.ADD_TO_SCORE,
    playerIndex: playerIndex,
    amount: amount
  };
}

export function setPlayerName(playerId, name){
  return {
    type: types.SET_PLAYER_NAME,
    playerId: playerId,
    name: name
  };
}

export function addChatMessage(gameId, message){
  return {
    type: types.ADD_CHAT_MESSAGE,
    gameId: gameId,
    message: message
  };
}

export function addGame(gameId, name){
  return {
    type: types.ADD_GAME,
    gameId: gameId,
    name: name
  };
}

export function removeGame(gameId){
  return {
    type: types.REMOVE_GAME,
    gameId: gameId
  };
}

export function addPlayer(playerId, name){
  return {
    type: types.ADD_PLAYER,
    playerId: playerId,
    name: name
  };
}

export function removePlayer(playerId){
  return {
    type: types.REMOVE_PLAYER,
    playerId: playerId
  };
}

export function gameResetState(){
  return {
    type: types.GAME_RESET_STATE
  };
}

export function gameNextState(){
  return {
    type: types.GAME_NEXT_STATE
  };
}

//client
export function cSetConnected(val){
  return {
    type: types.C_SET_CONNECTED,
    val: val
  };
}
