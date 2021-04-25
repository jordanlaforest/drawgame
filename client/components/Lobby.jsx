import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {List} from 'immutable';
import { connect } from 'react-redux';

import Button from 'react-bootstrap/lib/Button';

import './styles/lobby.css';
import LobbyCard from './LobbyCard.jsx';
import Icon from './Icon.jsx';

import {getGameList, refreshGames} from '../modules/gameList';
import {joinGame, getJoiningGameId} from '../modules/joinGame';

class Lobby extends React.Component {
  render() {
    let games = this.props.games;
    return (
      <Fragment>
        <nav>
          <Button onClick={this.props.refreshGames}>Create Game</Button>
          <Button onClick={this.props.refreshGames}><Icon icon="refresh"/></Button>
        </nav>
        <div className="lobby">
          {
            games.map(game =>
              <LobbyCard key={game.get('id')} game={game} joinGame={this.props.joinGame} joining={this.props.joiningGameId === game.get('id')}/>
            )
          }
        </div>
      </Fragment>
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
    joinGame: (gameId, password='') => dispatch(joinGame(gameId, password))
  };
})(Lobby);
