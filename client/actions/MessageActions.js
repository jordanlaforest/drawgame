import { Actions } from 'flummox';

import { CHAT_EVENT, SERVER_MESSAGE_EVENT } from '../../common/EventConstants';

const DEFAULT_SERVER_NAME = '[INFO]';

class MessageActions extends Actions {
  constructor(socket) {
    super();
    this.socket = socket;

    // listen to socket events
    this.onChat = (messageObject) => this.addMessage(messageObject);
    this.onServerMessage = (message) => this.addMessage({ name: DEFAULT_SERVER_NAME, message });

    this.socket.on(CHAT_EVENT, this.onChat);
    this.socket.on(SERVER_MESSAGE_EVENT, this.onServerMessage);
  }

  removeSocketListeners() {
    this.socket.off(CHAT_EVENT, this.onChat);
    this.socket.off(SERVER_MESSAGE_EVENT, this.onServerMessage);
  }

  createMessage(message, name) {
    this.socket.emit(CHAT_EVENT, message);
    this.addMessage({ name, message });
  }

  addMessage(messageObject) {
    return messageObject;
  }
}

export default MessageActions;
