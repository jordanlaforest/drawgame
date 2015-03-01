import { Store } from 'flummox';

class GameStore extends Store {
  constructor(flux) {
    super();

    let gameActionIds = flux.getActionIds('games');
    this.register(gameActionIds.getGames, this.addGames);
    this.register(gameActionIds.getGameInfo, this.setupGame);

    this.playerActions = flux.getActions('players');

    this.state = {
      currentWord: 'Dog',
      drawingPlayer: 0,
      games: []
    };
  }

  addGames(games) {
    this.setState({
      games
    });
  }

  setupGame({ currentWord, currentlyDrawing }) {
    this.setState({
      currentWord,
      currentlyDrawing
    });
  }
}

export default GameStore;
