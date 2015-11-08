import React from 'react';

import Panel from 'react-bootstrap/lib/Panel';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

var Main = React.createClass({
  render: function () {
    let { players, isDrawing } = this.props;
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

export default Main;
