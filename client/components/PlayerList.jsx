import React from 'react';
import PropTypes from 'prop-types';
import {Map, List} from 'immutable';

import {Panel, ListGroup, ListGroupItem} from 'react-bootstrap';

class PlayerList extends React.Component {
  render() {
    let { gamePlayers, allPlayers, currentlyDrawing } = this.props;
    return (
      <Panel header="Players">
        <ListGroup>
          {
            gamePlayers.valueSeq()
              .map((player, idx) => {
                let p = allPlayers.get(player.get('id'));
                return (
                  <ListGroupItem active={currentlyDrawing === idx} key={idx}>
                    { p.get('name') } <span className="pull-right"> { player.get('score') }</span>
                  </ListGroupItem>);
              })
          }
        </ListGroup>
      </Panel>
    );
  }
}

PlayerList.propTypes = {
  gamePlayers: PropTypes.instanceOf(List).isRequired,
  allPlayers: PropTypes.instanceOf(Map).isRequired,
  currentlyDrawing: PropTypes.number.isRequired
};

export default PlayerList;
