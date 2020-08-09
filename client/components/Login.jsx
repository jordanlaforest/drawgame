import React from 'react';
import PropTypes from 'prop-types';

import Panel from 'react-bootstrap/lib/Panel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import {ENTER_KEY_CODE} from '../../common/constants';

class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {name: ''};
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col md={2} className="center-block gridClearfix">
            <Panel>
              <Panel.Heading>Choose a name</Panel.Heading>
              <Panel.Body>
                <FormControl
                  type="text"
                  onChange={this.onChange}
                  value={this.state.name}
                  onKeyDown={this.onKeyDown}
                />
                <span className="input-group-btn">
                  <Button onClick={this.submit}>Submit</Button>
                </span>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }

  onChange = (event) => {
    this.setState({name: event.target.value});
  }

  onKeyDown = ({ keyCode }) => {
    if(keyCode === ENTER_KEY_CODE) {
      this.submit();
    }
  }

  submit = () => {
    this.props.submitCB(this.state.name);
    this.setState({name: ''});
  }
}

Login.propTypes = {
  submitCB: PropTypes.func.isRequired
};

export default Login;