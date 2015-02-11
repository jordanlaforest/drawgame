import React from 'react';
import Marty from 'marty';
import Dispatcher from 'marty/dispatcher';
Dispatcher = Dispatcher.getCurrent();

import Panel from 'react-bootstrap/Panel';
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
      penDown: false,
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

      if(type === DrawingConstants.PEN_DOWN.toString()) {
        let point = this.scaleToPixels(action.arguments[0]);
        this._dropPen(point);
      } else if(type === DrawingConstants.PEN_MOVE.toString()) {
        let point = this.scaleToPixels(action.arguments[0]);
        this._movePen(lastPoint, point);
      } else if(type === DrawingConstants.PEN_UP.toString()) {
        let point = this.scaleToPixels(action.arguments[0]);
        this._raisePen(lastPoint, point);
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
          onMouseDown={amIDrawing ? this.dropPen : noop}
          onMouseMove={amIDrawing ? this.movePen : noop}
          onMouseLeave={amIDrawing ? this.raisePen : noop}
          onMouseUp={amIDrawing ? this.raisePen : noop}
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
    }
  },
  dropPen(event) {
    let mousePoint = this.getMousePoint(event);
    this._dropPen(mousePoint);
    DrawingActionCreators.sendPenDown(this.scaleToPercent(mousePoint));
  },
  _dropPen(lastPoint) {
    this.setState({
      lastPoint,
      point: lastPoint,
      penDown: true
    });
  },
  movePen(event) {
    let point = this.getMousePoint(event);
    if(this.state.penDown) {
      DrawingActionCreators.sendPenMove(this.scaleToPercent(point));
    }
    this._movePen(this.state.point, point);
  },
  _movePen(lastPoint, point) {
    this.setState({
      lastPoint,
      point
    });

    if( this.state.penDown ) {
      let ctx = this.getCanvas().getContext('2d');
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  },
  raisePen(event) {
    let lastPoint = this.state.point;
    let point = this.getMousePoint(event);

    if(this.state.penDown) {
      DrawingActionCreators.sendPenUp(this.scaleToPercent(point));
    }
    this._raisePen(lastPoint, point);
  },
  _raisePen(lastPoint, point) {
    this.setState({
      penDown: false,
      lastPoint,
      point
    });
  }
});

export default GameCanvas;
