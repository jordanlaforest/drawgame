import { Actions } from 'flummox';
import fetch from 'node-fetch';

// TODO fix this
// origin is so that this works anywhere, not just localhost.
const API_PATH = 'api';

class GameActions extends Actions {
  constructor(host) {
    super();
    this.host = host;
  }

  getGameInfo(gameId) {
    return fetch(`${this.host}${API_PATH}/game/${gameId}/info`)
      .then( (res) => res.json() );
  }

  getGames() {
    return fetch(`${this.host}${API_PATH}/games`)
      .then( (res) => res.json() );
  }
}

export default GameActions;
