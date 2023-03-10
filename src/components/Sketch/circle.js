import { Tools } from '@/components'
import { linearDistance } from './utils'
import FabricCanvasTool from './fabrictool'

const { fabric } = require('fabric')

class Circle extends FabricCanvasTool {
  configureCanvas (props) {
    const canvas = this._canvas
    canvas.isDrawingMode = false
    canvas.selection = false
    canvas.forEachObject((o) => {
      o.selectable = false
      o.evented = false
    })
    this._width = props.lineWidth
    this._color = props.lineColor
    this._fill = props.fillColor
  }

  getToolName () {
    return Tools.Corp
  }

  doMouseDown (o) {
    const canvas = this._canvas
    this.isDown = true
    let pointer = canvas.getPointer(o.e)
    ;[
      this.startX,
      this.startY,
    ] = [
      pointer.x,
      pointer.y,
    ]
    this.circle = new fabric.Circle({
      left: this.startX,
      top: this.startY,
      originX: 'left',
      originY: 'center',
      id: 'SKIP',
      strokeWidth: this._width,
      stroke: this._color,
      fill: this._fill,
      selectable: false,
      evented: false,
      radius: 1,
    })
    canvas.add(this.circle)
  }

  doMouseMove (o) {
    if (!this.isDown) return
    const canvas = this._canvas
    let pointer = canvas.getPointer(o.e)
    this.circle.set({
      radius:
        linearDistance(
          { x: this.startX, y: this.startY },
          { x: pointer.x, y: pointer.y },
        ) / 2,
      angle:
        Math.atan2(pointer.y - this.startY, pointer.x - this.startX) *
        180 /
        Math.PI,
      selectable: false,
      evented: false,
    })
    this.circle.setCoords()
    canvas.renderAll()
  }

  doMouseUp () {
    const canvas = this._canvas
    this.isDown = false

    canvas.remove(this.circle)
    let circle = new fabric.Group([
      this.circle,
    ])
    circle.selectable = false
    circle.evented = false
    canvas.add(circle)
  }
}

export default Circle
