import {Map} from 'immutable';

import * as types from '../ActionTypes';
import * as g from './game';
import * as s from './server';

export function setState(state = Map(), newState){
  return newState;
}

export function mergeState(state = Map(), newState){
  return state.merge(newState);
}

function initialState(){
  return Map({ players: Map(), games: Map()});
}

export default function reducer(state = initialState(), action){
  switch(action.type){
  case types.SET_STATE:
    return setState(state, action.state);
  case types.MERGE_STATE:
    return mergeState(state, action.state);
  case types.ADD_GAME:
    return state.update('games', gamesState => s.addGame(gamesState, action.gameId, action.name));
  case types.REMOVE_GAME:
    return state.update('games', gamesState => s.removeGame(gamesState, action.gameId));
  case types.SET_PLAYER_NAME:
    return state.update('players', playersState => s.setPlayerName(playersState, action.playerId, action.name));
  case types.ADD_PLAYER:
    return state.update('players', playersState => s.addPlayerToServer(playersState, action.playerId, action.name));
  case types.REMOVE_PLAYER:
    return state.update('players', playersState => s.removePlayerFromServer(playersState, action.player));
  case types.SET_CURRENT_WORD:
    return state.update('games', games => {
      return games.update(action.gameId, gameState => g.setCurrentWord(gameState, action.word));
    });
  case types.SET_GAME_NAME:
    return state.update('games', games => {
      return games.update(action.gameId, gameState => g.setGameName(gameState, action.name));
    });
  case types.ADD_PLAYER_TO_GAME:
    return state.update('games', games => {
      return games.update(action.gameId, gameState => g.addPlayerToGame(gameState, action.playerId));
    });
  case types.REMOVE_PLAYER_FROM_GAME:
    return state.update('games', games => {
      return games.update(action.gameId, gameState => g.removePlayerFromGame(gameState, action.playerId));
    });
  case types.ADD_POINT_TO_DRAWING:
    return state.update('games', games => {
      return games.update(action.gameId, gameState => g.addPointToDrawing(gameState, action.point));
    });
  case types.END_PATH_IN_DRAWING:
    return state.update('games', games => {
      return games.update(action.gameId, gameState => g.endPathInDrawing(gameState));
    });
  case types.SET_CURRENTLY_DRAWING:
    return state.update('games', games => {
      return games.update(action.gameId, gameState => g.setCurrentlyDrawing(gameState, action.playerIndex));
    });
  case types.ADD_TO_SCORE:
    return state.update('games', games => {
      return games.update(action.gameId, gameState => g.addToScore(gameState, action.playerIndex, action.amount));
    });
  case types.ADD_CHAT_MESSAGE:
    return state.update('games', games => {
      return games.update(action.gameId, gameState => g.addChatMessage(gameState, action.message));
    });
  case types.GAME_RESET_STATE:
    return state.update('games', games => {
      return games.update(action.gameId, gameState => g.gameResetState(gameState));
    });
  case types.GAME_NEXT_STATE:
    return state.update('games', games => {
      return games.update(action.gameId, gameState => g.gameNextState(gameState));
    });
  //client
  case types.C_SET_CONNECTED:
    return state.set('connected', action.val);
  default:
    return state;
  }
}