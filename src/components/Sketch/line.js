import { Tools } from '@/components'
import FabricCanvasTool from './fabrictool'

const { fabric } = require('fabric')

class Line extends FabricCanvasTool {
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

  getToolName () {
    return Tools.Line
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
    canvas.add(this.line)
  }

  doMouseMove (o) {
    if (!this.isDown) return
    let canvas = this._canvas
    let pointer = canvas.getPointer(o.e)
    this.line.set({ x2: pointer.x, y2: pointer.y })
    this.line.setCoords()
    canvas.renderAll()
  }

  doMouseUp () {
    let canvas = this._canvas
    this.isDown = false

    canvas.remove(this.line)
    let line = new fabric.Group([
      this.line,
    ])
    canvas.add(line)
  }

  doMouseOut () {
    this.isDown = false
  }
}

export default Line
