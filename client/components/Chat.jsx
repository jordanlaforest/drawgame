import React from 'react';
import PropTypes from 'prop-types';
import {Panel, FormControl, Button} from 'react-bootstrap';
import {List} from 'immutable';

import {ENTER_KEY_CODE} from '../../common/constants';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
  }

  render() {
    let panelFooter = (
      <div>
        <FormControl
          type="text"
          onChange={this.onChange}
          value={this.state.value}
          onKeyDown={this.onKeyDown}
        />
        <span className="input-group-btn">
          <Button onClick={this.sendMessage}>Send</Button>
        </span>
      </div>
    );

    return (
      <Panel header="Chat" footer={panelFooter} >
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
