import {Map} from 'immutable';

export default class AppState {
	constructor() {
		//thisPlayer (client), connected (client)
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

	getPlayer(playerId){
		return this.players.get(playerId);
	}

	addPlayerToGame(gameId, playerId){
		//Remove player from game he's already in, if needed
		let player = Map({id: playerId, score: 0});
		this.games = this.games.updateIn([gameId, 'players'], playerList => playerList.push(player));
	}

}