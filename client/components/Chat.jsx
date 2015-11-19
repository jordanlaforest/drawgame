import React from 'react';

import Panel from 'react-bootstrap/lib/Panel';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';

import {ENTER_KEY_CODE} from '../../common/constants';

let Chat = React.createClass({
  getInitialState: function() {
    return {value: ''}; //Since this doesn't really affect the game state, I'm not gonna use redux for it
  },
  render() {
    let panelFooter = (
      <Input
        type="text"
        onChange={this.onChange}
        value={this.state.value}
        onKeyDown={this.onKeyDown}
        buttonAfter={<Button onClick={this.sendMessage}>Send</Button>}/>
    );

    return (
      <Panel header="Chat" footer={panelFooter} >
        <ul className="list-unstyled">
          {
            this.props.messages.map( (msg, idx) => {
              return <li key={idx}><strong>{msg.get('name')}:</strong> {msg.get('message')}</li>;
            })
          }
        </ul>
      </Panel>
    );
  },
  onChange(event){
    this.setState({value: event.target.value});
  },
  onKeyDown({ keyCode }) {
    if(keyCode === ENTER_KEY_CODE) {
      this.sendMessage();
    }
  },
  sendMessage() {
    this.props.sendChatCB(this.state.value);
    this.setState({value: ''});
  }
});

export default Chat;
