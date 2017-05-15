import React from 'react';
import {Map, fromJS} from 'immutable';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';

import Table from 'react-bootstrap/lib/Table';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';

import Login from './Login.jsx';

import {INIT_EVENT_LOBBY, REQUEST_GAMES} from '../../common/EventConstants';
import {setState, mergeState} from '../../common/actions';

class Lobby extends React.Component {
  componentDidMount() {
    this.props.callbacks.requestGames();
  }

  render() {
    if(!this.props.connected){
      return <Login submitCB={this.submitInit} />;
    }else{
      let games = this.props.games;
      return (
        <div>
          {/*<ButtonLink to="creategame">Create Game</ButtonLink>*/}

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
                games.valueSeq().map(game =>
                  <tr key={game.get('id')}>
                    <td>{game.get('password') ? <Glyphicon glyph="lock" /> : <div></div> }</td>
                    <td>{game.get('name')}</td>
                    <td>?/?</td>
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

  submitInit = (data) => {
    if(this.props.socket.connected){
      this.props.callbacks.lobbyInit(data.name);
    }else{
      console.err('Not connected to server');
    }
  }
}

export default connect(state => {
  return {
    games: state.get('games'),
    connected: state.get('connected')
  }
})(Lobby);
