import { Actions } from 'flummox';
import fetch from 'node-fetch';

// TODO fix this
// origin is so that this works anywhere, not just localhost.
let apiPath = 'api';
let { origin } = window.location;
let base = origin + window.location.pathname;

class GameActions extends Actions {
  constructor() {
    super();
  }

  getGameInfo(gameId) {
    return fetch(`${base}${apiPath}/game/${gameId}/info`)
      .then( (res) => res.json() );
  }

  getGames() {
    return fetch(`${base}${apiPath}/games`)
      .then( (res) => res.json() );
  }
}

export default GameActions;
