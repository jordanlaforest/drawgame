import React from 'react';

import Panel from 'react-bootstrap/Panel';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

var PlayerList = React.createClass({
  render: function () {
    let { players, currentlyDrawing } = this.props;

    let isDrawing = (id) => id === currentlyDrawing;
    return (
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
    );
  }
});

export default PlayerList;
