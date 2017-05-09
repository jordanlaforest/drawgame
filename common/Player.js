import {fromJS} from 'immutable';

export default function createPlayer(id, name, score){
	let p = {
	    id: id,
	    name: name,
	    score: score
	};
	return fromJS(p);
}

/*export default class Player {
  constructor(id, name, score) {
    this.id = id;
    this.name = name;
    this.score = score;
    this.game = undefined;
  }
}*/
