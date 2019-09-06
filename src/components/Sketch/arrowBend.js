/*eslint no-unused-vars: 0*/

import FabricCanvasTool from './fabrictool'

const fabric = require('fabric').fabric

class ArrowBend extends FabricCanvasTool {
  configureCanvas (props) {
    let canvas = this._canvas
    canvas.isDrawingMode = false
    canvas.selection = false
    canvas.forEachObject((o) => (o.selectable = o.evented = false))
    this._width = props.lineWidth
    this._color = props.lineColor
  }

  doMouseDown (o) {
    
    this.isDown = true
    let canvas = this._canvas
    var pointer = canvas.getPointer(o.e)
    var points = [
      pointer.x,
      pointer.y,
      pointer.x,
      pointer.y,
    ]
    this.pencil = new fabric.PatternBrush( {
      strokeWidth: this._width,
      fill: this._color,
      stroke: this._color,
      id: 'ARROW',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
    })

    this.head = new fabric.Triangle({
      fill: this._color,
      left: pointer.x,
      top: pointer.y,
      id: 'ARROW',
      originX: 'center',
      originY: 'center',
      height: 3 * this._width,
      width: 3 * this._width,
      selectable: false,
      evented: false,
      angle: 90,
    })

    canvas.add(this.pencil)
    canvas.add(this.head)
  }

  doMouseMove (o) {
    if (!this.isDown) return
    let canvas = this._canvas
    var pointer = canvas.getPointer(o.e)
   // this.pencil.set({ x2: pointer.x, y2: pointer.y })
  //  this.pencil.setCoords()

    let x_delta = pointer.x - this.pencil.x1
    let y_delta = pointer.y - this.pencil.y1

    this.head.set({
      left: pointer.x,
      top: pointer.y,
      angle: 90 + Math.atan2(y_delta, x_delta) * 180 / Math.PI,
    })

    canvas.renderAll()
  }

  doMouseUp (o) {
    this.isDown = false
    let canvas = this._canvas

     canvas.remove(this.pencil)
    canvas.remove(this.head)
    let arrowBend = new fabric.Group([
      this.pencil,
      this.head,
    ])
    arrowBend.selectable = false
    arrowBend.evented = false
    canvas.add(arrowBend)
  }

  doMouseOut (o) {
    this.isDown = false
  }
}

export default ArrowBend
