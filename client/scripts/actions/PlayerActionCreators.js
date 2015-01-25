import Marty from 'marty';
import PlayerConstants from '../constants/PlayerConstants';

var PlayerActionCreators = Marty.createActionCreators({
  initPlayer: PlayerConstants.INIT_PLAYER(),
  addPlayer: PlayerConstants.ADD_PLAYER()
});

export default PlayerActionCreators;
