import React from 'react';
import Marty from 'marty';
import Dispatcher from 'marty/dispatcher';
Dispatcher = Dispatcher.getCurrent();

import Panel from 'react-bootstrap/Panel';
import DrawingActionCreators from '../actions/DrawingActionCreators';
import DrawingConstants from '../constants/DrawingConstants';

var GameCanvas = React.createClass({

  getInitialState () {
    let width = 800;
    let height = 600;
    return {
      width,
      height,
      drawing: false,
      lastPoint: { x: 0, y: 0 },
      point: { x: 0, y: 0 }
    };
  },

  componentDidMount () {
    this.listenOnDispatcher();
  },

  componentWillUnmount () {
    Dispatcher.unregister(this.dispatchToken);
  },

  listenOnDispatcher() {
    this.dispatchToken = Dispatcher.register( (action) => {
      let { type } = action;
      let { point: lastPoint } = this.state;
      // console.log(action);

      if(type === DrawingConstants.PATH_START.toString()) {
        let point = this.scalePoint(action.arguments[0]);
        this._drawStart(point);
      } else if(type === DrawingConstants.PATH_MOVE.toString()) {
        let point = this.scalePoint(action.arguments[0]);
        this._drawMove(lastPoint, point);
      } else if(type === DrawingConstants.PATH_END.toString()) {
        let point = this.scalePoint(action.arguments[0]);
        this._drawEnd(lastPoint, point);
      }
    });
  },

  render() {
    let { currentWord, username, amIDrawing } = this.props;
    let { width, height } = this.state;

    let strongWord = <p>Your word is <strong>{currentWord}</strong></p>;
    let strongUsername = <p><strong>{username}</strong> is currently drawing</p>;
    let canvasHeader = amIDrawing ? strongWord : strongUsername;
    return (
      <Panel header={ canvasHeader }>
        <canvas
          width={width}
          height={height}
          onMouseDown={this.drawStart}
          onMouseMove={this.drawMove}
          onMouseLeave={this.drawEnd}
          onMouseUp={this.drawEnd}
          ref="canvas">
        </canvas>
      </Panel>
    );
  },
  convertPoint({ x, y }) {
    let { width, height } = this.state;
    return {
      x: x / width,
      y: y / height
    };
  },
  scalePoint({ x, y }) {
    let { width, height } = this.state;
    return {
      x: x * width,
      y: y * height
    };
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
    }
  },
  drawStart(event) {
    let mousePoint = this.getMousePoint(event);
    this._drawStart(mousePoint);
    DrawingActionCreators.startPath(this.convertPoint(mousePoint));
  },
  _drawStart(lastPoint) {
    this.setState({
      lastPoint,
      point: lastPoint,
      drawing: true
    });
  },
  drawMove(event) {
    let point = this.getMousePoint(event);
    if(this.state.drawing) {
      DrawingActionCreators.movePath(this.convertPoint(point));
    }
    this._drawMove(this.state.point, point);
  },
  _drawMove(lastPoint, point) {
    this.setState({
      lastPoint,
      point
    });

    if( this.state.drawing ) {
      let ctx = this.getCanvas().getContext('2d');
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  },
  drawEnd(event) {
    let lastPoint = this.state.point;
    let point = this.getMousePoint(event);

    if(this.state.drawing) {
      DrawingActionCreators.endPath(this.convertPoint(point));
    }
    this._drawEnd(lastPoint, point);
  },
  _drawEnd(lastPoint, point) {
    this.setState({
      drawing: false,
      lastPoint,
      point
    });
  }
});

export default GameCanvas;
