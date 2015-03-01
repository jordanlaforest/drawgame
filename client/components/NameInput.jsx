import React from 'react';

import { Input, Button } from 'react-bootstrap';

const ENTER_KEY_CODE = 13;

var NameInput = React.createClass({
  render() {
    return (
      /*eslint-disable no-undef */
      <Input
        type="text"
        onKeyDown={this.onKeyDown}
        buttonAfter={<Button onClick={this.updateName}>Update</Button>}/>
      /*eslint-enable no-undef */
    );
  },
  onKeyDown({ keyCode }) {
    if(keyCode === ENTER_KEY_CODE) {
      this.updateName();
    }
  },
  updateName(){
    console.log(`New name!`);
  }
});

export default NameInput;
