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
    drawingData: {paths: [], curPath: []},
    inIntermission: false,
    chatMessages: []
  };
  return fromJS(g);
}