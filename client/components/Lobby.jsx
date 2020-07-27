import React from 'react';
import PropTypes from 'prop-types';
import {List} from 'immutable';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';

import Table from 'react-bootstrap/lib/Table';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';

import {getGameList, refreshGames} from '../modules/gameList';

class Lobby extends React.Component {
  render() {
    let games = this.props.games;
    return (
      <div>
        {/*<ButtonLink to="creategame">Create Game</ButtonLink>*/}
        <Button onClick={this.props.refreshGames}><Glyphicon glyph="refresh" /></Button>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Password </th>
              <th>Game Name</th>
              <th>Players</th>
              <th>Join</th>
            </tr>
          </thead>
          <tbody>
            {
              games.map(game =>
                <tr key={game.get('id')}>
                  <td>{game.get('password') ? <Glyphicon glyph="lock" /> : <div></div> }</td>
                  <td>{game.get('name')}</td>
                  <td>{game.get('players').size + '/' + game.get('maxPlayers')}</td>
                  <td> <LinkContainer to={`/game/${game.get('id')}`}><Button>Join</Button></LinkContainer> </td>
                </tr>
              )
            }
          </tbody>
        </Table>
      </div>
    );
  }
}

Lobby.propTypes = {
  games: PropTypes.instanceOf(List).isRequired,
  refreshGames: PropTypes.func.isRequired
}

export default connect(state => {
  return {
    games: getGameList(state.gameList),
  };
},
dispatch => {
  return {
    refreshGames: () => dispatch(refreshGames())
  };
})(Lobby);
