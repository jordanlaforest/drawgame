import {
  SERVER_MESSAGE_EVENT,
  CHAT_EVENT
}
from '../common/EventConstants';
import Marty from 'marty';
import SocketStateSource from './socketMixin';
import MessagesActionsCreators from '../actions/MessagesActionCreators';

var MessagesSource = Marty.createStateSource({
  mixins: [SocketStateSource()],
  events: {
    [SERVER_MESSAGE_EVENT]: 'onServerMessage',
    [CHAT_EVENT]: 'onChat'
  },
  onServerMessage({ message }) {
    MessagesActionsCreators.addMessage({ name: '[INFO]', message });
  },
  onChat(message) {
    MessagesActionsCreators.addMessage(message);
  }
});

export default MessagesSource;
