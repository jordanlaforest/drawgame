import React from 'react';

import Panel from 'react-bootstrap/Panel';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

let isDrawing = () => false;

var Main = React.createClass({
  render: function () {
    let { players } = this.props;
    return (
      <Panel header="Players">
        <ListGroup>
        {
          players
            .map((player) =>
              <ListGroupItem active={isDrawing(player.id)}>
                { player.username } <span className="pull-right"> { player.score }</span>
              </ListGroupItem>
            )
        }
        </ListGroup>
      </Panel>
    );
  }
});

export default Main;
