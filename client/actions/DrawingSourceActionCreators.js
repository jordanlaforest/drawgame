import Marty from 'marty';
import DrawingConstants from '../constants/DrawingConstants';

var DrawingSourceActionCreators = Marty.createActionCreators({
  pathStart: DrawingConstants.PATH_START(),
  pathEnd: DrawingConstants.PATH_END(),
  pathMove: DrawingConstants.PATH_MOVE()
});
export default DrawingSourceActionCreators;
