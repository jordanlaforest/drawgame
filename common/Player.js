import {fromJS} from 'immutable';

export default function createPlayer(id, name){
  let p = {
    id: id,
    name: name
  };
  return fromJS(p);
}