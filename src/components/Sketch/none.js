import { Tools } from '@/components'
import FabricCanvasTool from './fabrictool'

class none extends FabricCanvasTool {
  configureCanvas (props) {
    this._canvas.isDrawingMode = false
    this._canvas.freeDrawingBrush.width = props.lineWidth
    this._canvas.freeDrawingBrush.color = props.lineColor
    this._canvas.forEachObject((o) => {
      o.selectable = false
      o.evented = false
    })
  }

  getToolName () {
    return Tools.None
  }
}

export default none
