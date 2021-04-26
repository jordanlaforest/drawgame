import React from 'react';
import PropTypes from 'prop-types';
import {List} from 'immutable';

import './styles/chat.css';

import Panel from 'react-bootstrap/lib/Panel';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';

import {ENTER_KEY_CODE} from '../../common/constants';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
  }

  render() {
    let panelFooter = (
      <div>
        <InputGroup>
          <FormControl
            type="text"
            onChange={this.onChange}
            value={this.state.value}
            onKeyDown={this.onKeyDown}
          />
          <InputGroup.Button>
            <Button onClick={this.sendMessage}>Send</Button>
          </InputGroup.Button>
        </InputGroup>
      </div>
    );

    return (
      <Panel>
        <Panel.Heading>Chat</Panel.Heading>
        <Panel.Body>
          <ul className="list-unstyled">
            {
              this.props.messages.valueSeq().map( (msg, idx) => {
                if(msg.has('name')){
                  return <li key={idx}><strong>{msg.get('name')}:</strong> {msg.get('message')}</li>;
                }else{
                  return <li className="server-message" key={idx}><strong>{msg.get('message')}</strong></li>;
                }
              })
            }
          </ul>
        </Panel.Body>
        <Panel.Footer>{panelFooter}</Panel.Footer>
      </Panel>
    );
  }

  onChange = (event) => {
    this.setState({value: event.target.value});
  }

  onKeyDown = ({ keyCode }) => {
    if(keyCode === ENTER_KEY_CODE) {
      this.sendMessage();
    }
  }

  sendMessage = () => {
    this.props.sendChatCB(this.state.value);
    this.setState({value: ''});
  }
}

Chat.propTypes = {
  messages: PropTypes.instanceOf(List).isRequired,
  sendChatCB: PropTypes.func.isRequired
};

export default Chat;
