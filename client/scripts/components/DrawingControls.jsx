import React from 'react';

import Panel from 'react-bootstrap/Panel';

import Grid from 'react-bootstrap/Grid';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

var DrawingControls = React.createClass({
  render: function () {
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
});

export default DrawingControls;
