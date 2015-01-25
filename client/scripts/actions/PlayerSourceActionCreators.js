import Marty from 'marty';
import PlayerConstants from '../constants/PlayerConstants';

var PlayerSourceActionCreators = Marty.createActionCreators({
  addPlayer: PlayerConstants.ADD_PLAYER(),
  addPlayers: PlayerConstants.ADD_PLAYERS()
});

export default PlayerSourceActionCreators;
