import Marty from 'marty';
import MainConstants from '../constants/MainConstants';

var MainStore = Marty.createStore({
  handlers: {
    addGames: MainConstants.ADD_GAMES
  },
  getInitialState() {
    return {
      games: []
    };
  },
  addGames(games) {
    this.state.games.push(...games);
    this.hasChanged();
  },
  getGames() {
    return this.state.games;
  },
  unloadGames() {
    this.state.games = [];
  }
});

export default MainStore;
