import Marty from 'marty';
import GameConstants from '../constants/GameConstants';
import PlayersStore from './PlayersStore';

var GameStore = Marty.createStore({
  handlers: {
    onInitGame: GameConstants.INIT_GAME
  },
  getInitialState() {
    return {
      currentWord: 'Dog',
      drawingPlayer: 0,
    };
  },
  getCurrentWord() {
    return this.state.currentWord;
  },
  getDrawingPlayer() {
    return PlayersStore.getPlayer(this.state.drawingPlayer);
  },
  amIDrawing() {
    return this.isDrawing(PlayersStore.getThePlayer().id);
  },
  isDrawing(id) {
    return this.state.drawingPlayer === id;
  },
  onInitGame() {
    console.log('starting game');
  }
});

export default GameStore;
