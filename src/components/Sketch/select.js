

import FabricCanvasTool from './fabrictool'

class Select extends FabricCanvasTool {
  configureCanvas () {
    let canvas = this._canvas
    canvas.isDrawingMode = false
    canvas.selection = true
    canvas.forEachObject((o) => {
      o.selectable = true
      o.evented = true 
    })
  }
}

export default Select
