import React from 'react';
import Router from 'react-router';
let { RouteHandler } = Router;

var App = React.createClass({
  render() {
    return (
      <div>
        <RouteHandler/>
      </div>
    );
  }
});

export default App;
