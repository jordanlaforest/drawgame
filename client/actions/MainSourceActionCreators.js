import Marty from 'marty';
import MainConstants from '../constants/MainConstants';

var MainSourceActionCreators = Marty.createActionCreators({
  addGames: MainConstants.ADD_GAMES(),
});
export default MainSourceActionCreators;
