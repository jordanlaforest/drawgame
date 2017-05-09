import {fromJS} from 'immutable';

export default function createGame (id, name){
	let g = {
	    id: id,
	    name: name,
	    password: '',
	    maxPlayers: 5,
	    currentlyDrawingPlayer: 0,
	    players: [],
	    currentWord: '',
	    drawingData: {},
	    inIntermission: false
	};
	return fromJS(g);
}

/*export default class Game {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.password = '';
    this.maxPlayers = 5;
    this.currentlyDrawingPlayer = 0;
    this.players = [];
    this.currentWord = '';
    this.drawingData = {};
    this.inIntermission = false;
    this.chatMessages = [];

  }
}*/
