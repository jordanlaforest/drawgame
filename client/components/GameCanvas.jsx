import React from 'react';
import { Panel } from 'react-bootstrap';

var noop = () => 0;

var GameCanvas = React.createClass({
  componentDidMount() {
    let drawingStore = this.props.flux.getStore('drawing');
    drawingStore.setCanvasContext(this.getCanvas().getContext('2d'));

    this.scaleFn = drawingStore.scaleToPercent.bind(drawingStore);
  },
  render() {
    let { flux } = this.props;
    this.drawingActions = flux.getActions('drawing');

    // drawing props
    let { width, height } = this.props;

    // other props
    let { currentWord, currentlyDrawing, player: { id } } = this.props;
    let amIDrawing = id === currentlyDrawing;

    // change the canvas header based on who's drawing
    /*eslint-disable no-undef */
    let yourWord = <p>Your word is <strong>{currentWord}</strong></p>;
    let someoneElseDrawing = <p><strong>{name}</strong> is currently drawing</p>;
    let canvasHeader = amIDrawing ? yourWord : someoneElseDrawing;

    return (
      <Panel header={ canvasHeader }>
        <canvas
          width={width}
          height={height}
          onMouseDown={amIDrawing ? this.dropPen : noop}
          onMouseMove={amIDrawing ? this.movePen : noop}
          onMouseLeave={amIDrawing ? this.raisePen : noop}
          onMouseUp={amIDrawing ? this.raisePen : noop}
          ref="canvas">
        </canvas>
      </Panel>
      /*eslint-enable no-undef */
    );
  },
  getCanvas() {
    return this.refs.canvas.getDOMNode();
  },
  getMouseX({ clientX }) {
    return clientX - this.getCanvas().getBoundingClientRect().left;
  },
  getMouseY({ clientY }) {
    return clientY - this.getCanvas().getBoundingClientRect().top;
  },
  getMousePoint(event) {
    return {
      x: this.getMouseX(event),
      y: this.getMouseY(event)
    };
  },
  dropPen(event) {
    this.drawingActions.dropPen(this.getMousePoint(event), this.scaleFn);
  },
  movePen(event) {
    this.drawingActions.movePen(this.getMousePoint(event), this.scaleFn);
  },
  raisePen(event) {
    this.drawingActions.raisePen(this.getMousePoint(event), this.scaleFn);
  }
});

export default GameCanvas;
