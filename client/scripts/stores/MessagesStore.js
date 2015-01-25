import Marty from 'marty';
import MessagesConstants from '../constants/MessagesConstants';

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
  getMessages() {
    return this.state.messages;
  },
  addMessage(message) {
    this.state.messages.push(message);
    this.hasChanged();
  },
  sendMessage(message) {
    this.addMessage({ name: 'Me', message });
  }
});

// add default messages
MessagesStore.addMessage({ name: 'Bob', message: 'Hey Guys!' });
MessagesStore.addMessage({ name: 'Patrick', message: 'Hello!' });
MessagesStore.addMessage({ name: 'Sandy', message: 'You guys suck at this!' });
MessagesStore.addMessage({ name: 'Bob', message: ':( '});

export default MessagesStore;