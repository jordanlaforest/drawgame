import Marty from 'marty';
import MessagesConstants from '../constants/MessagesConstants';

var MessagesActionCreators = Marty.createActionCreators({
  addMessage: MessagesConstants.ADD_MESSAGE(),
  sendMessage: MessagesConstants.SEND_MESSAGE()
});

export default MessagesActionCreators;
