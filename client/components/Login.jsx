import React from 'react';

import {Panel, FormControl, Button, Grid, Row, Col} from 'react-bootstrap';

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
            <Panel header="Choose a name">
              <FormControl
                type="text"
                onChange={this.onChange}
                value={this.state.name}
                onKeyDown={this.onKeyDown}
              />
              <span className="input-group-btn">
                <Button onClick={this.submit}>Submit</Button>
              </span>
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

export default Login;