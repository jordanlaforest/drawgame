import React from 'react';
import PropTypes from 'prop-types';

import Panel from 'react-bootstrap/lib/Panel';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';

import './styles/prompt.css';

import {ENTER_KEY_CODE} from '../../common/constants';

class Prompt extends React.Component {
  constructor(props){
    super(props);
    this.state = {value: ''};
  }

  render() {
    return (
      <div className="prompt">
        <Panel>
          <Panel.Heading>{this.props.title}</Panel.Heading>
          <Panel.Body>
            <InputGroup>
              <FormControl
                type="text"
                onChange={this.onChange}
                value={this.state.value}
                onKeyDown={this.onKeyDown}
              />
              <InputGroup.Button>
                <Button onClick={this.submit}>Submit</Button>
              </InputGroup.Button>
            </InputGroup>
          </Panel.Body>
        </Panel>
      </div>
    );
  }

  onChange = (event) => {
    this.setState({value: event.target.value});
  }

  onKeyDown = ({ keyCode }) => {
    if(keyCode === ENTER_KEY_CODE) {
      this.submit();
    }
  }

  submit = () => {
    this.props.submitCB(this.state.value);
    this.setState({value: ''});
  }
}

Prompt.propTypes = {
  submitCB: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default Prompt;