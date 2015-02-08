import Marty from 'marty';
import GameBrowserConstants from '../constants/GameBrowserConstants';

var GameBrowserSourceActionCreators = Marty.createActionCreators({
  addGames: GameBrowserConstants.ADD_GAMES(),
});
export default GameBrowserSourceActionCreators;
