import {Map, List} from 'immutable';

export function addPlayerToServer(state = Map(), playerId, name){
  let player = Map({id: playerId, name: name, game: ''});
  return state.set(playerId, player);
}

export function removePlayerFromServer(state = Map(), playerId){
  return state.remove(playerId);
}

export function addGame(state = Map(), gameId, name){
  let game =  Map({
    id: gameId,
    name: name,
    password: '',
    maxPlayers: 5,
    currentlyDrawingPlayer: 0,
    players: List(),
    currentWord: '',
    drawingData: Map({paths: List(), curPath: List()}),
    inIntermission: false,
    chatMessages: List()
  });
  return state.set(gameId, game);
}

export function removeGame(state = Map(), gameId){
  return state.remove(gameId);
}

export function setPlayerName(state = Map(), playerId, name){
  return state.update(playerId, player => player.set('name', name));
}

export function setPlayerGame(state = Map(), playerId, gameId){
  return state.update(playerId, player => player.set('game', gameId));
}