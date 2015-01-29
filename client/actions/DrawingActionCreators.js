import Marty from 'marty';
import DrawingConstants from '../constants/DrawingConstants';

var DrawingActionCreators = Marty.createActionCreators({
  startPath: DrawingConstants.SEND_PATH_START(),
  endPath: DrawingConstants.SEND_PATH_END(),
  movePath: DrawingConstants.SEND_PATH_MOVE(),
});

export default DrawingActionCreators;
