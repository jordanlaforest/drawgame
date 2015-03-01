import React from 'react';
import { ButtonLink } from 'react-router-bootstrap';

import { Table, Glyphicon } from 'react-bootstrap';

var GameBrowser = React.createClass({
  mixins: [],
  render() {
    // games is passed by FluxComponent on RouteHandler in App.jsx
    let { games } = this.props;
    return (
      /*eslint-disable no-undef */
      <div>
        <ButtonLink to="creategame">Create Game</ButtonLink>

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
      /*eslint-enable no-undef */
    );
  }
});

export default GameBrowser;
