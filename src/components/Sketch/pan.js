import FabricCanvasTool from './fabrictool'

class Pan extends FabricCanvasTool {
  configureCanvas () {
    let canvas = this._canvas
    canvas.isDrawingMode = false
    canvas.selection = false
    canvas.forEachObject((o) => {
      o.selectable = true
      o.evented = true
    })
    canvas.defaultCursor = 'move'
  }

  doMouseDown (o) {
    let canvas = this._canvas
    this.isDown = true
    let pointer = canvas.getPointer(o.e)
    this.startX = pointer.x
    this.startY = pointer.y

    let obj = canvas.getActiveObject()
    if (obj) {
      obj.set({
        id: 'pan',
      })
    }
  }

  doMouseMove (o) {
    if (!this.isDown) return
    let canvas = this._canvas
    let pointer = canvas.getPointer(o.e)

    canvas.relativePan({
      x: pointer.x - this.startX,
      y: pointer.y - this.startY,
    })
    canvas.renderAll()
  }

  doMouseUp () {
    let canvas = this._canvas
    let obj = canvas.getActiveObject()
    if (obj) {
      obj.set({
        id: 'pan',
      })
    }
    this.isDown = false
  }
}

export default Pan
