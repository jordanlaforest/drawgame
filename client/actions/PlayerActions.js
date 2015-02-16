import { Actions } from 'flummox';

import Player from '../common/Player';
import { INIT_EVENT } from '../../common/EventConstants';

const PROMPT_MSG        = 'Please choose a name:';
const INVALID_NAME_MSG  = 'Invalid name, please try again.';

function isValidName(name) {
  return name !== undefined && name !== null;
}

class PlayerActions extends Actions {

  constructor(socket) {
    super();

    this.socket = socket;
  }

  initPlayer() {
    let name = localStorage.getItem('player.name');

    // is the name invalid? keep prompting
    let invalid = !isValidName(name);
    while(invalid) {
      name = prompt(PROMPT_MSG);
      invalid = !isValidName(name);
      if(invalid) {
        alert(INVALID_NAME_MSG);
      }
    }

    let newPlayer = new Player({  name, id: 0, score: 0 });
    this.socket.emit(INIT_EVENT, newPlayer);

    return newPlayer;
  }
}

export default PlayerActions;
