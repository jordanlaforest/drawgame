import React from 'react';
import PropTypes from 'prop-types';

import Panel from 'react-bootstrap/lib/Panel';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import {ENTER_KEY_CODE} from '../../common/constants';

class Prompt extends React.Component {
  constructor(props){
    super(props);
    this.state = {value: ''};
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col md={2} className="center-block gridClearfix">
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
          </Col>
        </Row>
      </Grid>
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