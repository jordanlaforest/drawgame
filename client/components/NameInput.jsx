import React from 'react/addons';

import Input from 'react-bootstrap/Input';
import Button from 'react-bootstrap/Button';

import Marty from 'marty';

const ENTER_KEY_CODE = 13;

var NameInput = React.createClass({
  render() {
    return (
      <Input 
        type="text"
        onKeyDown={this.onKeyDown}
        buttonAfter={<Button onClick={this.updateName}>Update</Button>}/>
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
