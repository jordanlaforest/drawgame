import Marty from 'marty';
import MainSourceActionCreators from '../actions/MainSourceActionCreators';
import GameSourceActionCreators from '../actions/GameSourceActionCreators';

// origin is so that this works anywhere, not just localhost.
let apiPath = 'api';
let { origin } = window.location;
let base = origin + window.location.pathname;

var GameAPI = Marty.createStateSource({
  type: 'http',
  baseUrl: base,
  loadGames () {
    this.get(`${apiPath}/games`)
      .then( ({ body: games }) => MainSourceActionCreators.addGames(games) );
  },
  loadGame (gameId) {
    this.get(`${apiPath}/game/${gameId}/info`)
      .then( ({ body: info }) => GameSourceActionCreators.initGame(info) );
  }
});

export default GameAPI;
