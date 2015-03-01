import React from 'react';

import { Panel, Grid, Row, Col } from 'react-bootstrap';

var DrawingControls = React.createClass({
  render: function () {
    return (
      /*eslint-disable no-undef */
      <Panel header="DrawingControls">
        <Grid fluid>
          <Row fluid>
            <Col className="lopadding" md={4}> <div className="colour-box red"> </div> </Col>
            <Col className="lopadding" md={4}> <div className="colour-box blue"> </div> </Col>
            <Col className="lopadding" md={4}> <div className="colour-box green"> </div> </Col>
          </Row>
        </Grid>
      </Panel>
      /*eslint-enable no-undef */
    );
  }
});

export default DrawingControls;
