import Marty from 'marty';
import DrawingConstants from '../constants/DrawingConstants';

var DrawingSourceActionCreators = Marty.createActionCreators({
  penDown: DrawingConstants.PEN_DOWN(),
  penUp: DrawingConstants.PEN_UP(),
  penMove: DrawingConstants.PEN_MOVE()
});
export default DrawingSourceActionCreators;
