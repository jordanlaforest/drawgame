import Marty from 'marty';
import GameConstants from '../constants/GameConstants';
import PlayerSourceActionCreators from './PlayerSourceActionCreators';
import PlayerActionCreators from './PlayerActionCreators';

var GameSourceActionCreators = Marty.createActionCreators({
  initGame: GameConstants.INIT_GAME(function({ players, currentWord, currentlyDrawing }) {

    PlayerSourceActionCreators.addPlayers(players);
    PlayerActionCreators.initPlayer();

    this.dispatch({ currentWord, currentlyDrawing });
  })
});

export default GameSourceActionCreators;
