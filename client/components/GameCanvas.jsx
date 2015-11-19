import React from 'react';
import {Map} from 'immutable';
import Panel from 'react-bootstrap/lib/Panel';

var noop = () => 0;

var GameCanvas = React.createClass({
  componentDidMount () {
  },

  componentWillUnmount () {
  },

  /*listenOnDispatcher() {
    this.dispatchToken = Dispatcher.register( (action) => {
      let { type } = action;
      let { point: lastPoint } = this.state;

      if(type === DrawingConstants.PATH_START.toString()) {
        let point = this.scaleToPixels(action.arguments[0]);
        this._drawStart(point);
      } else if(type === DrawingConstants.PATH_MOVE.toString()) {
        let point = this.scaleToPixels(action.arguments[0]);
        this._drawMove(lastPoint, point);
      } else if(type === DrawingConstants.PATH_END.toString()) {
        let point = this.scaleToPixels(action.arguments[0]);
        this._drawEnd(lastPoint, point);
      }
    });
  },*/
  componentDidUpdate() {
    this.renderDrawing();
  },
  render() {
    let currentWord = this.props.currentWord;
    let amIDrawing = this.props.thisPlayer === this.props.currentlyDrawing;
    let name = amIDrawing ? '' : this.props.allPlayers.get(this.props.currentlyDrawing);
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
          onMouseLeave={amIDrawing ? this.drawEnd : noop}
          onMouseUp={amIDrawing ? this.drawEnd : noop}
          ref="canvas">
        </canvas>
      </Panel>
    );
  },
  renderDrawing(){
    this.clearCanvas();
    let ctx = this.getContext();
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    let paths = this.props.paths;
    ctx.beginPath();
    paths.forEach(this.renderPath);
    ctx.stroke();
  },
  renderPath(path){
    let ctx = this.getContext();
    path.forEach((point, i) => {
      let {x, y} = this.scaleToPixels(point.toJS());
      if(i === 0){
        ctx.moveTo(x, y);
      }else{
        ctx.lineTo(x, y);
      }
    });
  },
  clearCanvas(){
    let { w, h } = this.getCanvasSize();
    this.getContext().clearRect(0, 0, w, h);
  },
  scaleToPercent({ x, y }) {
    let { w, h } = this.getCanvasSize();
    return {
      x: x / w,
      y: y / h
    };
  },
  scaleToPixels({ x, y }) {
    let { w, h } = this.getCanvasSize();
    return {
      x: x * w,
      y: y * h
    };
  },
  getCanvasSize() {
    return this.props.canvasSize.toJS();
  },
  getCanvas() {
    return this.refs.canvas;
  },
  getContext() {
    return this.getCanvas().getContext('2d');
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
  drawStart(event) {
    let point = this.getMousePoint(event);
    this.props.addPointCB(Map(this.scaleToPercent(point)));
  },
  drawMove(event) {
    if(event.buttons > 0){ //any button pressed
      let point = this.getMousePoint(event);
      this.props.addPointCB(Map(this.scaleToPercent(point)));
    }
  },
  drawEnd(event) {
    if(event.buttons > 0){
      //the player has drawn off the canvas, send one last point so the line extends to the edge
      let point = this.getMousePoint(event);
      this.props.addPointCB(Map(this.scaleToPercent(point)));
    }
    this.props.endPathCB();
  }
});

export default GameCanvas;
