import Marty from 'marty';
import DrawingConstants from '../constants/DrawingConstants';

import { PATH_START_EVENT, PATH_MOVE_EVENT, PATH_END_EVENT, CHAT_EVENT } from '../../common/EventConstants';
var DrawingStore = Marty.createStore({
  handlers: {
    onSendPathStart: DrawingConstants.SEND_PATH_START,
    onSendPathEnd: DrawingConstants.SEND_PATH_END,
    onSendPathMove: DrawingConstants.SEND_PATH_MOVE
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
  onSendPathStart(point) {
    this.state.socket.emit(PATH_START_EVENT, point);
  },
  onSendPathEnd(point) {
    this.state.socket.emit(PATH_END_EVENT, point);
  },
  onSendPathMove(point) {
    this.state.socket.emit(PATH_MOVE_EVENT, point);
  }
});

export default DrawingStore;
