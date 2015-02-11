import Marty from 'marty';
import DrawingConstants from '../constants/DrawingConstants';

var DrawingActionCreators = Marty.createActionCreators({
  sendPenDown: DrawingConstants.SEND_PEN_DOWN(),
  sendPenUp: DrawingConstants.SEND_PEN_UP(),
  sendPenMove: DrawingConstants.SEND_PEN_MOVE(),
});

export default DrawingActionCreators;
