import React from 'react';

import {Panel, FormControl, Button} from 'react-bootstrap';

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
            this.props.messages.map( (msg, idx) => {
              return <li key={idx}><strong>{msg.get('name')}:</strong> {msg.get('message')}</li>;
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

export default Chat;
