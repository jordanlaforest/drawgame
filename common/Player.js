import {fromJS} from 'immutable';

export default function createPlayer(id, name){
	let p = {
	    id: id,
	    name: name
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
