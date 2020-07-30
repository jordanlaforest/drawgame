import React from 'react';
import PropTypes from 'prop-types';
import {Map, List} from 'immutable';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

class PlayerList extends React.Component {
  render() {
    let { gamePlayers, allPlayers, currentlyDrawing } = this.props;
    return (
      <Card header="Players">
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
      </Card>
    );
  }
}

PlayerList.propTypes = {
  gamePlayers: PropTypes.instanceOf(List).isRequired,
  allPlayers: PropTypes.instanceOf(Map).isRequired,
  currentlyDrawing: PropTypes.number.isRequired
};

export default PlayerList;
