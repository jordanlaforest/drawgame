import Marty from 'marty';
import GameConstants from '../constants/GameConstants';
import PlayerActionsCreators from './PlayerActionCreators';

var GameActionCreators = Marty.createActionCreators({
  initGame: GameConstants.INIT_GAME(function() {
    // this is where we get stuff from the server
    PlayerActionsCreators.initPlayer();
    PlayerActionsCreators.addPlayer('Bob', 4);
    PlayerActionsCreators.addPlayer('Patrick', 0);
    PlayerActionsCreators.addPlayer('Sandy', 7);
  })
});

export default GameActionCreators;
