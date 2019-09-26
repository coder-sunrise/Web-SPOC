import FabricCanvasTool from './fabrictool'

const { fabric } = require('fabric')

class Arrow extends FabricCanvasTool {
  configureCanvas (props) {
    let canvas = this._canvas

    canvas.isDrawingMode = false
    canvas.selection = false
    canvas.forEachObject((o) => {
      o.selectable = false
      o.evented = false
    })
    this._width = props.lineWidth
    this._color = props.lineColor
  }

  doMouseDown (o) {
    this.isDown = true
    let canvas = this._canvas
    let pointer = canvas.getPointer(o.e)
    let points = [
      pointer.x,
      pointer.y,
      pointer.x,
      pointer.y,
    ]
    this.line = new fabric.Line(points, {
      strokeWidth: this._width,
      fill: this._color,
      stroke: this._color,
      id: 'SKIP',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
    })

    this.head = new fabric.Triangle({
      fill: this._color,
      left: pointer.x,
      top: pointer.y,
      id: 'SKIP',
      originX: 'center',
      originY: 'center',
      height: 3 * this._width,
      width: 3 * this._width,
      selectable: false,
      evented: false,
      angle: 90,
    })

    canvas.add(this.line)
    canvas.add(this.head)
  }

  doMouseMove (o) {
    if (!this.isDown) return
    let canvas = this._canvas
    let pointer = canvas.getPointer(o.e)
    this.line.set({ x2: pointer.x, y2: pointer.y })
    this.line.setCoords()

    let xDelta = pointer.x - this.line.x1
    let yDelta = pointer.y - this.line.y1

    this.head.set({
      left: pointer.x,
      top: pointer.y,
      angle: 90 + Math.atan2(yDelta, xDelta) * 180 / Math.PI,
    })

    canvas.renderAll()
  }

  doMouseUp () {
    this.isDown = false
    let canvas = this._canvas

    canvas.remove(this.line)
    canvas.remove(this.head)
    let arrow = new fabric.Group([
      this.line,
      this.head,
    ])
    arrow.selectable = false
    arrow.evented = false
    arrow.id = 'abc'
    canvas.add(arrow)
  }

  doMouseOut () {
    this.isDown = false
  }
}

export default Arrow
