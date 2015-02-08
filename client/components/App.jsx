import React from 'react';
import Router from 'react-router';
let { RouteHandler } = Router;

var App = React.createClass({
  render() {
    return (
      <div className="container-fluid">
        <header className="header">
          <h3 className="text-muted">Draw Game</h3>
        </header>

        <div>
          <RouteHandler/>
        </div>

        <footer className="footer">
          <p>Created by Jordan Laforest and Nicholas Dujay</p>
        </footer>
      </div>
    );
  }
});

export default App;
