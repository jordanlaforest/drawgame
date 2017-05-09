import React from 'react';

import Panel from 'react-bootstrap/lib/Panel';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class DrawingControls extends React.Component {
  render() {
    return (
      <Panel header="DrawingControls">
        <Grid fluid>
          <Row fluid>
            <Col className="lopadding" md={4}> <div className="colour-box red"> </div> </Col>
            <Col className="lopadding" md={4}> <div className="colour-box blue"> </div> </Col>
            <Col className="lopadding" md={4}> <div className="colour-box green"> </div> </Col>
          </Row>
        </Grid>
      </Panel>
    );
  }
}

export default DrawingControls;
