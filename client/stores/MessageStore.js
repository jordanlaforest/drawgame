import { Store } from 'flummox';

const TEST_MESSAGES = [
  { name: 'Bob', message: 'Hey Guys!' },
  { name: 'Patrick', message: 'Hello!' },
  { name: 'Sandy', message: 'You guys suck at this!' },
  { name: 'Bob', message: ':( '}
];

class MessagesStore extends Store {
  constructor(flux) {
    super();

    let messageActionIds = flux.getActionIds('messages');
    this.register(messageActionIds.addMessage, this.addMessage);

    this.state = {
      messages: TEST_MESSAGES
    };
  }

  addMessage(message) {
    this.setState({
      messages: this.state.messages.concat([message])
    });
  }
}

export default MessagesStore;
