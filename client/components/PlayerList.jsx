import React from 'react';
import PropTypes from 'prop-types';
import {Map, List} from 'immutable';

import Badge from 'react-bootstrap/lib/Badge';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Panel from 'react-bootstrap/lib/Panel';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

class PlayerList extends React.Component {
  render() {
    let { gamePlayers, allPlayers, currentlyDrawing, thisPlayerId } = this.props;
    return (
      <Panel>
        <Panel.Heading>Players</Panel.Heading>
        <ListGroup>
          {
            gamePlayers.valueSeq()
              .map((player, idx) => {
                let p = allPlayers.get(player.get('id'));
                return (
                  <ListGroupItem active={currentlyDrawing === idx} key={idx}>
                    { currentlyDrawing === idx ? <Glyphicon glyph='pencil' /> : undefined }
                    { 
                      player.get('id') === thisPlayerId ? (
                        <strong>{' ' + p.get('name')}</strong>
                      ) : ' ' + p.get('name')
                    }
                    <Badge pullRight> { player.get('score') + ' pts'}</Badge>
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
  currentlyDrawing: PropTypes.number.isRequired,
  thisPlayerId: PropTypes.string.isRequired
};

export default PlayerList;
