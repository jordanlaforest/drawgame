import {Map} from 'immutable';

import {default as gameReducer, addPlayerToGame, removePlayerFromGame} from '../common/modules/game.js';

export default class ServerState {
  constructor() {
    this.players = Map();
    this.games = Map();
    this.intervalIds = Map();
  }

  addGame(game){
    this.games = this.games.set(game.get('id'), game);
  }

  getGame(gameId){
    return this.games.get(gameId);
  }

  addPlayer(player){
    this.players = this.players.set(player.get('id'), player);
  }

  removePlayer(playerId){
    this.players = this.players.delete(playerId);
  }

  getPlayer(playerId){
    return this.players.get(playerId);
  }

  addPlayerToGame(gameId, playerId){
    this.applyActionToGame(addPlayerToGame(playerId), gameId);
    this.players = this.players.update(playerId, player => player.set('gameId', gameId));
  }

  removePlayerFromGame(gameId, playerId){
    this.applyActionToGame(removePlayerFromGame(playerId), gameId);
    this.players = this.players.update(playerId, player => player.delete('gameId'));
  }

  applyActionToGame(action, gameId){
    this.games = this.games.update(gameId, game => gameReducer(game, action));
  }

  checkPlayerDrawing(playerId){
    let game = this.getGame(this.getPlayer(playerId).get('gameId'));
    return game.get('isStarted') && !game.get('inIntermission')
      && game.get('players').get(game.get('currentlyDrawingPlayer')).get('id') === playerId;
  }

  saveTimer(gameId, intervalId){
    this.intervalIds = this.intervalIds.set(gameId, intervalId);
  }

  clearTimer(gameId){
    clearInterval(this.intervalIds.get(gameId));
    this.intervalIds = this.intervalIds.delete(gameId);
  }
}