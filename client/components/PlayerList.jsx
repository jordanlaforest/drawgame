import React from 'react';

import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap';

var PlayerList = React.createClass({
  render: function () {
    let { players, currentlyDrawing } = this.props;

    let isDrawing = (id) => id === currentlyDrawing;
    return (
      /*eslint-disable no-undef */
      <Panel header="Players">
        <ListGroup>
        {
          players
            .map((player, idx) =>
              <ListGroupItem active={isDrawing(player.id)} key={idx}>
                { player.name } <span className="pull-right"> { player.score }</span>
              </ListGroupItem>
            )
        }
        </ListGroup>
      </Panel>
      /*eslint-enable no-undef */
    );
  }
});

export default PlayerList;
