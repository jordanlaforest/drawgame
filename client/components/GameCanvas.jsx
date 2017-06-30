import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';

var noop = () => 0;

class GameCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.renderCallbackId = 0;
  }
  componentDidUpdate(prevProps) {
    if(prevProps.paths != this.props.paths){
      if(this.renderCallbackId == 0){
        this.renderCallbackId = window.requestAnimationFrame(this.renderDrawing.bind(this));
      }
    }else{
      console.log('Skipped path rendering.');
    }
  }

  render() {
    let currentWord = this.props.currentWord;
    let currentlyDrawingId = this.props.gamePlayers.get(this.props.currentlyDrawing).get('id');
    let amIDrawing = this.props.thisPlayer === this.props.currentlyDrawing;
    let name = amIDrawing ? '' : this.props.allPlayers.get(currentlyDrawingId).get('name');
    let { w, h } = this.getCanvasSize();

    let canvasHeader = '';
    if(amIDrawing){
      canvasHeader = <p>Your word is <strong>{currentWord}</strong></p>;
    }else{
      canvasHeader = <p><strong>{name}</strong> is currently drawing</p>;
    }
    return (
      <Panel header={ canvasHeader }>
        <canvas
          width={w}
          height={h}
          onMouseDown={amIDrawing ? this.drawStart : noop}
          onMouseMove={amIDrawing ? this.drawMove : noop}
          onMouseLeave={amIDrawing ? this.drawLeave : noop}
          onMouseUp={amIDrawing ? this.drawEnd : noop}
          ref="canvas">
        </canvas>
      </Panel>
    );
  }

  renderDrawing(){
    this.renderCallbackId = 0;
    this.clearCanvas();
    let ctx = this.getContext();
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    let paths = this.props.paths;
    ctx.beginPath();
    paths.forEach(this.renderPath);
    ctx.stroke();
  }

  renderPath = (path) => {
    let ctx = this.getContext();
    path.forEach((point, i) => {
      let {x, y} = this.scaleToPixels(point.toJS());
      if(i === 0){
        ctx.moveTo(x, y);
      }else{
        ctx.lineTo(x, y);
      }
    });
  }

  clearCanvas(){
    let { w, h } = this.getCanvasSize();
    this.getContext().clearRect(0, 0, w, h);
  }

  scaleToPercent({ x, y }) {
    let { w, h } = this.getCanvasSize();
    return {
      x: x / w,
      y: y / h
    };
  }

  scaleToPixels({ x, y }) {
    let { w, h } = this.getCanvasSize();
    return {
      x: x * w,
      y: y * h
    };
  }

  getCanvasSize() {
    return this.props.canvasSize.toJS();
  }

  getCanvas() {
    return this.refs.canvas;
  }

  getContext() {
    return this.getCanvas().getContext('2d');
  }

  getMouseX({ clientX }) {
    return clientX - this.getCanvas().getBoundingClientRect().left;
  }

  getMouseY({ clientY }) {
    return clientY - this.getCanvas().getBoundingClientRect().top;
  }

  getMousePoint(event) {
    return {
      x: this.getMouseX(event),
      y: this.getMouseY(event)
    };
  }

  drawStart = event => {
    let point = this.getMousePoint(event);
    this.props.addPointCB(this.scaleToPercent(point));
  }

  drawMove = event => {
    if(event.buttons > 0){ //any button pressed
      let point = this.getMousePoint(event);
      this.props.addPointCB(this.scaleToPercent(point));
    }
  }

  drawLeave = event => {
    if(event.buttons > 0){
      //the player has drawn off the canvas, send one last point so the line extends to the edge
      let point = this.getMousePoint(event);
      this.props.addPointCB(this.scaleToPercent(point));
      this.props.endPathCB();
    }
  }

  drawEnd = event => {
    this.props.endPathCB();
  }
}

export default GameCanvas;
