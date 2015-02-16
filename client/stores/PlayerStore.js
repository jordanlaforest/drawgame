import { Store } from 'flummox';

import Player from '../common/Player';

const PROMPT_MSG        = 'Please choose a name:';
const INVALID_NAME_MSG  = 'Invalid name, please try again.';

function isValidName(name) {
  return name !== undefined && name !== null;
}

class PlayerStore extends Store {
  constructor(flux) {
    super();

    let playerActionIds = flux.getActionIds('players');
    this.register(playerActionIds.initPlayer, this.initPlayer);

    this.state = {
      player: new Player({  name: '', id: 0, score: 0 }),
      players: []
    };
  }

  addPlayers(newPlayers) {
    this.setState({
      players: this.state.players.concat(newPlayers)
    });
  }

  unloadPlayers() {
    this.setState({
      players: []
    });
  }

  initPlayer(player) {
    this.setState({ player });
  }
}

export default PlayerStore;
