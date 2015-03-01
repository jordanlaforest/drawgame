import { Store } from 'flummox';

import Player from '../common/Player';

class PlayerStore extends Store {
  constructor(flux) {
    super();

    let playerActionIds = flux.getActionIds('players');
    let gameActionIds = flux.getActionIds('games');
    this.register(playerActionIds.initPlayer, this.initPlayer);
    this.register(gameActionIds.getGameInfo, ({ players }) => this.addPlayers(players));

    this.state = {
      player: new Player({ name: '', id: 0, score: 0 }),
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
