import Marty from 'marty';
import MessagesConstants from '../constants/MessagesConstants';
import { CHAT_EVENT } from '../common/EventConstants';

var MessagesStore = Marty.createStore({
  handlers: {
    addMessage: MessagesConstants.ADD_MESSAGE,
    sendMessage: MessagesConstants.SEND_MESSAGE
  },
  getInitialState() {
    return {
      messages: []
    };
  },
  setSocket(socket) {
    this.state.socket = socket;
  },
  removeSocket() {
    this.state.socket = null;
  },
  getMessages() {
    return this.state.messages;
  },
  addMessage(message) {
    this.state.messages.push(message);
    this.hasChanged();
  },
  sendMessage(message) {
    this.addMessage({ name: 'Me', message });
    this.state.socket.emit(CHAT_EVENT, message);
  }
});

// add default messages
MessagesStore.addMessage({ name: 'Bob', message: 'Hey Guys!' });
MessagesStore.addMessage({ name: 'Patrick', message: 'Hello!' });
MessagesStore.addMessage({ name: 'Sandy', message: 'You guys suck at this!' });
MessagesStore.addMessage({ name: 'Bob', message: ':( '});

export default MessagesStore;
