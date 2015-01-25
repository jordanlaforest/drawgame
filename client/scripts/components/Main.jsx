import React from 'react';
import { ButtonLink } from 'react-router-bootstrap';

import Table from 'react-bootstrap/Table';
import Glyphicon from 'react-bootstrap/Glyphicon';

var Main = React.createClass({
  render() {
    let games = [
      { name: "Canadian peeps", players: "5/10", password: false },
      { name: "American peeps", players: "2/4", password: true },
      { name: "British peeps", players: "3/8", password: true }
    ];
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

export default Main;
