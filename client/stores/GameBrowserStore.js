import Marty from 'marty';
import GameBrowserConstants from '../constants/GameBrowserConstants';

var GameBrowserStore = Marty.createStore({
  handlers: {
    addGames: GameBrowserConstants.ADD_GAMES
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

export default GameBrowserStore;
