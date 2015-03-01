import { Actions } from 'flummox';

import { PEN_DOWN_EVENT, PEN_MOVE_EVENT, PEN_UP_EVENT } from '../common/EventConstants';

class DrawingActions extends Actions {
  constructor(socket) {
    super();

    this.socket = socket;

    this.socket.on(PEN_DOWN_EVENT, this.onDropPen);
    this.socket.on(PEN_MOVE_EVENT, this.onMovePen);
    this.socket.on(PEN_UP_EVENT, this.onRaisePen);
  }

  dropPen(point, scale) {
    let scaled = scale(point);
    this.socket.emit(PEN_DOWN_EVENT, scaled);
    this.onDropPen(scaled);
  }

  onDropPen(point) {
    return point;
  }

  movePen(point, scale) {
    let scaled = scale(point);
    this.socket.emit(PEN_MOVE_EVENT, scaled);
    this.onMovePen(scaled);
  }

  onMovePen(point) {
    return point;
  }

  raisePen(point, scale) {
    let scaled = scale(point);
    this.socket.emit(PEN_UP_EVENT, scaled);
    this.onRaisePen(scaled);
  }

  onRaisePen(point) {
    return point;
  }
}

export default DrawingActions;
