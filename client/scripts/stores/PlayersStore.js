/* globals prompt, alert */
import Marty from 'marty';
import PlayerConstants from '../constants/PlayerConstants';
import PlayerLocalSource from '../sources/PlayerLocalSource';
import Player from '../common/Player';

const PROMPT_MSG        = 'Please choose a name:';
const INVALID_NAME_MSG  = 'Invalid name, please try again.';

function isValidName(name) {
  return name !== undefined && name !== null;
}

var PlayersStore = Marty.createStore({
  handlers: {
    addPlayer: PlayerConstants.ADD_PLAYER,
    addPlayers: PlayerConstants.ADD_PLAYERS,
    initPlayer: PlayerConstants.INIT_PLAYER
  },
  getInitialState() {
    return {
      player: PlayerLocalSource.player,
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
    this.hasChanged();
  },
  addPlayers(players) {
    this.state.players.push(...players);
    this.hasChanged();
  },
  unloadPlayers() {
    this.state.players = [];
    this.hasChanged();
  },
  initPlayer() {
    // check if it is in local storage already
    var name = PlayerLocalSource.getName();
    let invalid = !isValidName(name);
    while(invalid) {
      name = prompt(PROMPT_MSG);
      invalid = !isValidName(name);
      if(invalid) {
        alert(INVALID_NAME_MSG);
      }
    }
    PlayerLocalSource.setName(name);
  },
  getPlayer(idx) {
    return this.state.players[idx];
  },
  getThePlayer() {
    return this.state.player;
  }
});

export default PlayersStore;
