import { Store } from 'flummox';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;
class DrawingStore extends Store {
  constructor(flux) {
    super();

    let drawingActionIds = flux.getActionIds('drawing');
    this.register(drawingActionIds.onDropPen, this.onDropPen);
    this.register(drawingActionIds.onMovePen, this.onMovePen);
    this.register(drawingActionIds.onRaisePen, this.onRaisePen);

    this.state = {
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,

      lastPoint: { x: 0, y: 0 },
      point: { x: 0, y: 0 },
      colour: 'red'
    }
    this.ctx = null;
  }

  setCanvasContext(ctx) {
    this.ctx = ctx;
  }

  scaleToPercent({ x, y }) {
    let { width, height } = this.state;
    return {
      x: x / width,
      y: y / height
    };
  }

  scaleToPixels({ x, y }) {
    let { width, height } = this.state;
    return {
      x: x * width,
      y: y * height
    };
  }

  onDropPen(point) {
    point = this.scaleToPixels(point);
    this.setState({
      point,
      lastPoint: point,
      penDown: true
    });
  }

  onMovePen(newPoint) {
    newPoint = this.scaleToPixels(newPoint);
    let { point, penDown, lastPoint } = this.state;
    this.setState({
      lastPoint : point,
      point: newPoint
    });

    if(this.ctx !== null && penDown) {
      this.ctx.beginPath();
      this.ctx.moveTo(lastPoint.x, lastPoint.y);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
    }
  }

  onRaisePen(newPoint) {
    newPoint = this.scaleToPixels(newPoint);
    let { point, penDown } = this.state;
    if(penDown) {
      this.setState({
        lastPoint : point,
        point: newPoint,
        penDown: false,
      });
    }
  }

}

export default DrawingStore;
