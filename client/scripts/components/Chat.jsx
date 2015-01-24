import React from 'react';

import Panel from 'react-bootstrap/Panel';
import Input from 'react-bootstrap/Input';
import Button from 'react-bootstrap/Button';

let panelFooter = (
  <!-- on submit, send message -->
  <form role="form">
    <Input
      type="text"
      value=""
      buttonAfter={<Button>Send</Button>}/>
  </form>
);

var Chat = React.createClass({
  render() {
    let { messages } = this.props;
    return (
      <Panel header="Chat">
        <ul className="list-unstyled">
          {
            messages.map( (mes) => <li><strong>{mes.name}:</strong> { mes.text }</li>)
          }
        </ul>
      </Panel>
    );
  }
});

export default Chat;
