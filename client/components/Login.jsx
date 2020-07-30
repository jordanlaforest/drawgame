import React from 'react';
import PropTypes from 'prop-types';
import {Card, FormControl, Button, Container, Row, Col} from 'react-bootstrap';

import {ENTER_KEY_CODE} from '../../common/constants';

class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {name: ''};
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col md={2} className="center-block gridClearfix">
            <Card header="Choose a name">
              <FormControl
                type="text"
                onChange={this.onChange}
                value={this.state.name}
                onKeyDown={this.onKeyDown}
              />
              <span className="input-group-btn">
                <Button onClick={this.submit}>Submit</Button>
              </span>
            </Card>
          </Col>
        </Row>
      </Container>
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