import React from 'react/addons';
let { addons : { LinkedStateMixin }} = React;

import Panel from 'react-bootstrap/lib/Panel';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';

import Marty from 'marty';
import MessagesStore from '../stores/MessagesStore';
import MessagesActionsCreators from '../actions/MessagesActionCreators';

const ENTER_KEY_CODE = 13;

var ChatState = Marty.createStateMixin({
  listenTo: MessagesStore,
  getState() {
    return {
      message: '',
      messages: MessagesStore.getMessages()
    }
  }
});

var Chat = React.createClass({
  mixins: [LinkedStateMixin, ChatState],
  render() {
    let { messages } = this.state;

    let panelFooter = (
      <Input
        type="text"
        valueLink={this.linkState('message')}
        onKeyDown={this.onKeyDown}
        buttonAfter={<Button onClick={this.sendMessage}>Send</Button>}/>
    );

    return (
      <Panel header="Chat" footer={panelFooter} >
        <ul className="list-unstyled">
          {
            messages.map( ({ name, message }, idx) => <li key={idx}><strong>{name}:</strong> {message }</li>)
          }
        </ul>
      </Panel>
    );
  },
  onKeyDown({ keyCode }) {
    if(keyCode === ENTER_KEY_CODE) {
      this.sendMessage();
    }
  },
  sendMessage() {
    MessagesActionsCreators.sendMessage(this.state.message);
    this.setState({
      message: ''
    });
  }
});

export default Chat;
