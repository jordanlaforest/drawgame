import {
  PATH_START_EVENT, PATH_END_EVENT, PATH_MOVE_EVENT
}
from '../../common/EventConstants';
import Marty from 'marty';
import SocketStateSource from './socketMixin';
import DrawingSourceActionCreators from '../actions/DrawingSourceActionCreators';

var DrawingSource = Marty.createStateSource({
  mixins: [SocketStateSource()],
  events: {
    [PATH_START_EVENT]: 'onPathStart',
    [PATH_END_EVENT]: 'onPathEnd',
    [PATH_MOVE_EVENT]: 'onPathMove'
  },
  onPathStart(point) {
    DrawingSourceActionCreators.pathStart(point);
  },
  onPathMove(point) {
    DrawingSourceActionCreators.pathMove(point);
  },
  onPathEnd(point) {
    DrawingSourceActionCreators.pathEnd(point);
  }
});

export default DrawingSource;
