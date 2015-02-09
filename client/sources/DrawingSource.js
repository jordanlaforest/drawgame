import {
  PEN_DOWN_EVENT, PEN_UP_EVENT, PEN_MOVE_EVENT
}
from '../common/EventConstants';
import Marty from 'marty';
import SocketStateSource from './socketMixin';
import DrawingSourceActionCreators from '../actions/DrawingSourceActionCreators';

var DrawingSource = Marty.createStateSource({
  mixins: [SocketStateSource()],
  events: {
    [PEN_DOWN_EVENT]: 'onPenDown',
    [PEN_UP_EVENT]: 'onPenUp',
    [PEN_MOVE_EVENT]: 'onPenMove'
  },
  onPenDown(point) {
    DrawingSourceActionCreators.penDown(point);
  },
  onPenMove(point) {
    DrawingSourceActionCreators.penMove(point);
  },
  onPenUp(point) {
    DrawingSourceActionCreators.penUp(point);
  }
});

export default DrawingSource;
