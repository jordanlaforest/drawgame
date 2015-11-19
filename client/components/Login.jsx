import React from 'react';

import Panel from 'react-bootstrap/lib/Panel';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import {ENTER_KEY_CODE} from '../../common/constants';

let Login = React.createClass({
  getInitialState: function() {
    return {name: ''};
  },
  render() {
    return (
      <Grid fluid>
        <Row>
          <Col md={2} className="center-block gridClearfix">
            <Panel header="Choose a name">
              <Input
              type="text"
              onChange={this.onChange}
              value={this.state.name}
              onKeyDown={this.onKeyDown}
              buttonAfter={<Button onClick={this.submit}>Submit</Button>}/>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  },
  onChange(event){
    this.setState({name: event.target.value});
  },
  onKeyDown({ keyCode }) {
    if(keyCode === ENTER_KEY_CODE) {
      this.submit();
    }
  },
  submit() {
    this.props.submitCB({
      name: this.state.name
    });
    this.setState({name: ''});
  }
});

export default Login;