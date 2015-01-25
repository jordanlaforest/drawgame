import Marty from 'marty';
import GameConstants from '../constants/GameConstants';

var GameActionCreators = Marty.createActionCreators({
  sendPlayer: GameConstants.SEND_PLAYER()
});

export default GameActionCreators;
