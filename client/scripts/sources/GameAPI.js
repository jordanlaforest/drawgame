import Marty from 'marty';
import MainSourceActionCreators from '../actions/MainSourceActionCreators';
import GameSourceActionCreators from '../actions/GameSourceActionCreators';

var GameAPI = Marty.createStateSource({
  type: 'http',
  baseUrl: 'http://localhost:9000',
  loadGames () {
    this.get('/games')
      .then( (res) => res.json() )
      .then( (games) => MainSourceActionCreators.addGames(games) );
  },
  loadGame (gameId) {
    this.get(`/game/${gameId}/info`)
      .then( (res) => res.json() )
      .then( (info) => GameSourceActionCreators.initGame(info) );
  }
});

export default GameAPI;
