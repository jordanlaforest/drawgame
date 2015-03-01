import React from 'react/addons';
let { addons: { LinkedStateMixin }} = React;

import { Panel, Input, Button } from 'react-bootstrap';

const ENTER_KEY_CODE = 13;

var Chat = React.createClass({
  mixins: [LinkedStateMixin],

  getInitialState () {
    return {
      message: ''
    };
  },

  render() {
    let { message } = this.state;

    // in Game.jsx FluxComponent passes down 'messages' as a prop, since we
    // are connecting to the 'messages' store
    let { messages } = this.props;
    this.messageActions = this.props.flux.getActions('messages');

    /*eslint-disable no-undef */
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
            /*eslint-disable no-shadow */
            messages.map( ({ name, message }, idx) =>
              <li key={idx}>
                <strong>{name}:</strong> { message }
              </li>
            )
            /*eslint-enable no-shadow */
          }
        </ul>
      </Panel>
      /*eslint-enable no-undef */
    );
  },

  onKeyDown({ keyCode }) {
    if(keyCode === ENTER_KEY_CODE) {
      this.sendMessage();
    }
  },

  sendMessage() {
    // clear the message
    let { message } = this.state;
    this.setState({
      message: ''
    });

    // add the message to the store
    this.messageActions.createMessage(message, this.props.player.name);
  }
});

export default Chat;
