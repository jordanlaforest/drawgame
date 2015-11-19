import React from 'react';

import Panel from 'react-bootstrap/lib/Panel';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

let PlayerList = React.createClass({
  render: function () {
    let { gamePlayers, allPlayers, currentlyDrawing } = this.props;
    return (
      <Panel header="Players">
        <ListGroup>
        {
          gamePlayers.valueSeq()
            .map((player, idx) => {
              let p = allPlayers.get(player.get('id'));
              return (
              <ListGroupItem active={currentlyDrawing === player.get('id')} key={idx}>
                { p.get('name') } <span className="pull-right"> { player.get('score') }</span>
              </ListGroupItem>);
            })
        }
        </ListGroup>
      </Panel>
    );
  }
});

export default PlayerList;
