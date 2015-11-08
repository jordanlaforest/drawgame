import React from 'react';
import Marty from 'marty';
import * as D from 'marty/dispatcher';
let Dispatcher = D.getCurrent();

import Panel from 'react-bootstrap/lib/Panel';
import DrawingActionCreators from '../actions/DrawingActionCreators';
import DrawingConstants from '../constants/DrawingConstants';

var noop = () => 0;

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
  },

  render() {
    let { currentWord, name, amIDrawing } = this.props;
    let { width, height } = this.state;

    let yourWord = <p>Your word is <strong>{currentWord}</strong></p>;
    let someoneElseDrawing = <p><strong>{name}</strong> is currently drawing</p>;
    let canvasHeader = amIDrawing ? yourWord : someoneElseDrawing;
    return (
      <Panel header={ canvasHeader }>
        <canvas
          width={width}
          height={height}
          onMouseDown={amIDrawing ? this.drawStart : noop}
          onMouseMove={amIDrawing ? this.drawMove : noop}
          onMouseLeave={amIDrawing ? this.drawEnd : noop}
          onMouseUp={amIDrawing ? this.drawEnd : noop}
          ref="canvas">
        </canvas>
      </Panel>
    );
  },
  scaleToPercent({ x, y }) {
    let { width, height } = this.state;
    return {
      x: x / width,
      y: y / height
    };
  },
  scaleToPixels({ x, y }) {
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
    };
  },
  drawStart(event) {
    let mousePoint = this.getMousePoint(event);
    this._drawStart(mousePoint);
    DrawingActionCreators.startPath(this.scaleToPercent(mousePoint));
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
      DrawingActionCreators.movePath(this.scaleToPercent(point));
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
      DrawingActionCreators.endPath(this.scaleToPercent(point));
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
