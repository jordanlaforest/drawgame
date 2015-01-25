import Marty from 'marty';
import DrawingConstants from '../constants/DrawingConstants';

import Socket from '../utils/Socket';
import {
  PATH_START_EVENT, PATH_MOVE_EVENT, PATH_END_EVENT
}
from '../../../common/EventConstants';

var DrawingActionCreators = Marty.createActionCreators({
  startPath: DrawingConstants.SEND_PATH_START(function(point) {
    Socket.emit(PATH_START_EVENT, point);
  }),
  endPath: DrawingConstants.SEND_PATH_END(function(point) {
    Socket.emit(PATH_END_EVENT, point);
  }),
  movePath: DrawingConstants.SEND_PATH_MOVE(function(point) {
    Socket.emit(PATH_MOVE_EVENT, point);
  }),
});

export default DrawingActionCreators;
