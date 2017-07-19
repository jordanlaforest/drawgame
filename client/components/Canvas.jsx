import React from 'react';
import PropTypes from 'prop-types';
import {List} from 'immutable';

class Canvas extends React.Component {
  componentDidMount(){
    window.requestAnimationFrame(this.renderDrawing.bind(this));
    let setCanvasSize = () => {
      this.size = {w: this.canvas.clientWidth, h: this.canvas.clientWidth / 2};
      this.canvas.width = this.size.w;
      this.canvas.height = this.size.h;
    };
    window.onresize = setCanvasSize();
  }
  shouldComponentUpdate() {
    return false;
  }
  render(){

    return (
      <canvas
        onMouseDown={this.drawStart}
        onMouseMove={this.drawMove}
        onMouseLeave={this.drawLeave}
        onMouseUp={this.drawEnd}
        ref={ref => this.canvas = ref}>
      </canvas>
    );
  }
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
    window.requestAnimationFrame(this.renderDrawing.bind(this));
  }

  renderPath = (path) => {
    let ctx = this.getContext();
    path.forEach((point, i) => {
      let {x, y} = this.scaleToPixels(point);
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

  getCanvasSize(){
    return this.size;
  }

  getContext() {
    return this.canvas.getContext('2d');
  }

  getMouseX({ clientX }) {
    return clientX - this.canvas.getBoundingClientRect().left;
  }

  getMouseY({ clientY }) {
    return clientY - this.canvas.getBoundingClientRect().top;
  }

  getMousePoint(event) {
    return {
      x: this.getMouseX(event),
      y: this.getMouseY(event)
    };
  }

  drawStart = event => {
    let point = this.getMousePoint(event);
    this.props.addPoint(this.scaleToPercent(point));
  }

  drawMove = event => {
    if(event.buttons > 0){ //any button pressed
      let point = this.getMousePoint(event);
      this.props.addPoint(this.scaleToPercent(point));
    }
  }

  drawLeave = event => {
    if(event.buttons > 0){
      //the player has drawn off the canvas, send one last point so the line extends to the edge
      let point = this.getMousePoint(event);
      this.props.addPoint(this.scaleToPercent(point));
      this.props.endPath();
    }
  }

  drawEnd = () => {
    this.props.endPath();
  }
}

Canvas.propTypes = {
  paths: PropTypes.instanceOf(List).isRequired,
  addPoint: PropTypes.func.isRequired,
  endPath: PropTypes.func.isRequired
}

export default Canvas;