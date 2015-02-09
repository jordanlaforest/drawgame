import Marty from 'marty';
import DrawingConstants from '../constants/DrawingConstants';

import { PEN_DOWN_EVENT, PEN_MOVE_EVENT, PEN_UP_EVENT } from '../common/EventConstants';
var DrawingStore = Marty.createStore({
  handlers: {
    onSendPenDown: DrawingConstants.SEND_PEN_DOWN,
    onSendPenUp: DrawingConstants.SEND_PEN_UP,
    onSendPenMove: DrawingConstants.SEND_PEN_MOVE
  },
  getInitialState() {
    return {
      colour: 'red',
      socket: undefined
    };
  },
  setColor (color) {
    this.setState({ color });
    this.hasChanged();
  },
  setSocket(socket) {
    this.state.socket = socket;
  },
  removeSocket() {
    this.state.socket = null;
  },
  onSendMessage(message) {
    this.socket.emit(CHAT_EVENT, message);
  },
  onSendPenDown(point) {
    this.state.socket.emit(PEN_DOWN_EVENT, point);
  },
  onSendPenUp(point) {
    this.state.socket.emit(PEN_UP_EVENT, point);
  },
  onSendPenMove(point) {
    this.state.socket.emit(PEN_MOVE_EVENT, point);
  }
});

export default DrawingStore;
