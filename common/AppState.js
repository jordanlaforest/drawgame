import {Map} from 'immutable';

export default class AppState {
  constructor() {
    this.players = Map();
    this.games = Map();
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
    let player = Map({id: playerId, score: 0});
    this.games = this.games.updateIn([gameId, 'players'], playerList => playerList.push(player));
    this.players = this.players.update(playerId, player => player.set('gameId', gameId));
  }

  removePlayerFromGame(gameId, playerId){
    this.games = this.games.updateIn([gameId, 'players'], playerList => playerList.delete(playerList.indexOf(playerId)));
    this.players = this.players.update(playerId, player => player.delete('gameId'));
  }

}