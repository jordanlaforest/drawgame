import Marty from 'marty';
import React from 'react';
import { ButtonLink } from 'react-router-bootstrap';

import Table from 'react-bootstrap/Table';
import Glyphicon from 'react-bootstrap/Glyphicon';

import GameAPI from '../sources/GameAPI';
import GameBrowserStore from '../stores/GameBrowserStore';

var GameBrowserStateMixin = Marty.createStateMixin({
  listenTo: GameBrowserStore,
  getState() {
    return {
      games: GameBrowserStore.getGames()
    };
  }
});

var GameBrowser = React.createClass({
  mixins: [GameBrowserStateMixin],
  componentDidMount() {
    GameAPI.loadGames();
  },
  componentWillUnmount() {
    GameBrowserStore.unloadGames();
  },
  render() {
    let { games } = this.state;
    return (
      <div>
        <ButtonLink to="creategame">Create Game</ButtonLink>
        <ButtonLink to="editplayer">Edit Player</ButtonLink>

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
              games.map( ({ name, players, password }, idx) =>
                <tr key={idx}>
                  <td>{ password ? <Glyphicon glyph="lock" /> : <div></div> }</td>
                  <td>{name}</td>
                  <td>{players}</td>
                  <td> <ButtonLink to="game" params={{gameid: idx}}>Join</ButtonLink> </td>
                </tr>
              )
            }
          </tbody>
        </Table>
      </div>
    );
  }
});

export default GameBrowser;
