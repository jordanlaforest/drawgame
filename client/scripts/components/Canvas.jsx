import React from 'react';

import Panel from 'react-bootstrap/Panel';

let amIDrawing = () => true;
let getCurrentDrawingPlayer = () => ({ username: 'you' });

var Canvas = React.createClass({
  render() {
    let { playerId, currentWord } = this.props;
    return (
      <Panel header={
        amIDrawing(playerId) ?
         `Your word is <strong>${currentWord}</strong>` :
         `${getCurrentDrawingPlayer().username}</strong> is currently drawing`
      }>
          <canvas id="canvas" width="800" height="600"></canvas>
      </Panel>
    );
  }
});

export default Canvas;
