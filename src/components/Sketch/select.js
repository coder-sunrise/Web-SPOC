import FabricCanvasTool from './fabrictool'

class Select extends FabricCanvasTool {
  configureCanvas () {
    let canvas = this._canvas
    canvas.isDrawingMode = false
    canvas.selection = false
    canvas.forEachObject((o) => {
      o.selectable = true
      o.evented = true
    })
  }

  doMouseDown () {
    this.isDown = true
    let canvas = this._canvas
    this.isDown = true
    let obj = canvas.getActiveObject()
    if (obj) {
      obj.set({
        id: 'move',
      })
    }
  }

  doMouseUp () {
    let canvas = this._canvas
    this.isDown = false
    let obj = canvas.getActiveObject()
    if (obj) {
      obj.set({
        id: 'move',
      })
    }
  }
}

export default Select
