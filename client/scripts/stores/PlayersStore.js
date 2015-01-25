/* globals prompt, alert */
import Marty from 'marty';
import PlayerConstants from '../constants/PlayerConstants';
import PlayerSource from '../sources/PlayerSource';
import Player from '../../common/Player';

import { INIT_EVENT } from '../../common/EventConstants';
import Socket from '../utils/Socket';

const PROMPT_MSG        = 'Please choose a name:';
const INVALID_NAME_MSG  = 'Invalid name, please try again.';

function isValidName(name) {
  return name !== undefined && name !== null;
}

var PlayersStore = Marty.createStore({
  handlers: {
    addPlayer: PlayerConstants.ADD_PLAYER,
    initPlayer: PlayerConstants.INIT_PLAYER
  },
  getInitialState() {
    return {
      player: PlayerSource.player,
      players: [],
      id: 1
    };
  },
  addPlayer(name, score) {
    this.state.players.push(new Player({
      id: this.state.id++,
      name,
      score
    }));
  },
  initPlayer() {
    // check if it is in local storage already
    var name = PlayerSource.getName();
    let invalid = !isValidName(name);
    while(invalid) {
      name = prompt(PROMPT_MSG);
      invalid = !isValidName(name);
      if(invalid) {
        alert(INVALID_NAME_MSG);
      }
    }
    PlayerSource.setName(name);
    Socket.emit(INIT_EVENT, PlayerSource.player);
  },
  getPlayer(idx) {
    return this.state.players[idx];
  },
  getThePlayer() {
    return this.state.player;
  }
});

export default PlayersStore;
