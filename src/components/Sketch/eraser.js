import FabricCanvasTool from './fabrictool'

class Eraser extends FabricCanvasTool {
  configureCanvas () {
    const canvas = this._canvas
    canvas.isDrawingMode = false
    canvas.selection = true
    canvas.forEachObject((o) => {
      o.selectable = true
      o.evented = true
    })
    canvas.defaultCursor = 'cell'
  }

  doMouseDown () {
    const canvas = this._canvas
    this.isDown = true
    let obj = canvas.getActiveObject()

    if (obj) {
      obj.set({
        id: 'delete',
        removeObject: true,
      })
      canvas.remove(obj)
    }
  }

  doMouseUp () {
    const canvas = this._canvas
    this.isDown = false
    let obj = canvas.getActiveObject()
    if (obj) {
      obj.set({
        id: 'delete',
        removeObject: true,
      })
      canvas.remove(obj)
    }
  }
}

export default Eraser
