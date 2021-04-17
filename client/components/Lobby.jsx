import React from 'react';
import PropTypes from 'prop-types';
import {List} from 'immutable';
import { connect } from 'react-redux';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import LobbyCard from './LobbyCard.jsx';

import {getGameList, refreshGames} from '../modules/gameList';
import {joinGame, getJoiningGameId} from '../modules/joinGame';

class Lobby extends React.Component {
  render() {
    let games = this.props.games;
    return (
      <div>
        <nav>
          <Button onClick={this.props.refreshGames}>Create Game</Button>
          <Button onClick={this.props.refreshGames}><Glyphicon glyph="refresh" /></Button>
        </nav>
        <Grid fluid>
          <Row>
            {
              games.map(game =>
                <Col md={3} key={game.get('id')}>
                  <LobbyCard game={game} joinGame={this.props.joinGame} joining={this.props.joiningGameId === game.get('id')}/>
                </Col>
              )
            }
          </Row>
        </Grid>
      </div>
    );
  }
}

Lobby.propTypes = {
  games: PropTypes.instanceOf(List).isRequired,
  joiningGameId: PropTypes.string,
  refreshGames: PropTypes.func.isRequired,
  joinGame: PropTypes.func.isRequired
};

export default connect(state => {
  return {
    games: getGameList(state.gameList),
    joiningGameId: getJoiningGameId(state.joinGame)
  };
},
dispatch => {
  return {
    refreshGames: () => dispatch(refreshGames()),
    joinGame: (gameId) => dispatch(joinGame(gameId))
  };
})(Lobby);
