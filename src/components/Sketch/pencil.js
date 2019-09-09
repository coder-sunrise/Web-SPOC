import FabricCanvasTool from './fabrictool'

class Pencil extends FabricCanvasTool {
  configureCanvas (props) {
    this._canvas.isDrawingMode = true
    this._canvas.freeDrawingBrush.width = props.lineWidth
    this._canvas.freeDrawingBrush.color = props.lineColor
    this._canvas.forEachObject((o) => {
      o.selectable = false
      o.evented = false
    })
    
  }
}

export default Pencil
