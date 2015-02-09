import Marty from 'marty';
import DrawingConstants from '../constants/DrawingConstants';

var DrawingActionCreators = Marty.createActionCreators({
  startPath: DrawingConstants.SEND_PEN_DOWN(),
  endPath: DrawingConstants.SEND_PEN_UP(),
  movePath: DrawingConstants.SEND_PEN_MOVE(),
});

export default DrawingActionCreators;
