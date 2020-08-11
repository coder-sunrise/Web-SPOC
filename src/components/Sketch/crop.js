import { Tools } from '@/components'
import FabricCanvasTool from './fabrictool'

const { fabric } = require('fabric')

class Crop extends FabricCanvasTool {
  configureCanvas (props) {
    let canvas = this._canvas
    canvas.isDrawingMode = false
    canvas.selection = false
    canvas.forEachObject((o) => {
      o.selectable = false
      o.evented = false
    })
    this._width = props.lineWidth || 1
    this._color = props.lineColor || 'black'
    this._fill = props.fillColor
  }

  getToolName () {
    return Tools.Crop
  }

  doMouseDown (event) {
    let canvas = this._canvas
    this.isDown = true
    let pointer = canvas.getPointer(event.e)
    this.startX = pointer.x
    this.startY = pointer.y
    this.rect = new fabric.Rect({
      left: this.startX,
      top: this.startY,
      originX: 'left',
      originY: 'top',
      id: 'SKIP',
      width: pointer.x - this.startX,
      height: pointer.y - this.startY,
      stroke: this._color,
      strokeWidth: this._width,
      fill: this._fill,
      transparentCorners: true,
      selectable: false,
      evented: false,
      angle: 0,
    })
    canvas.add(this.rect)
  }

  doMouseMove (event) {
    if (!this.isDown) return
    let canvas = this._canvas
    let pointer = canvas.getPointer(event.e)
    if (this.startX > pointer.x) {
      this.rect.set({ left: Math.abs(pointer.x) })
    }
    if (this.startY > pointer.y) {
      this.rect.set({ top: Math.abs(pointer.y) })
    }
    this.rect.set({ width: Math.abs(this.startX - pointer.x) })
    this.rect.set({ height: Math.abs(this.startY - pointer.y) })
    this.rect.setCoords()
    canvas.renderAll()
  }

  doMouseUp () {
    let canvas = this._canvas
    this.isDown = false
    let cropped = new Image()
    const border = this._width
    const zoom = canvas.getZoom()

    cropped.src = canvas.toDataURL({
      left: this.rect.left * zoom + border,
      top: this.rect.top * zoom + border,
      width: this.rect.width * zoom - border,
      height: this.rect.height * zoom - border,
    })
    cropped.onload = function () {
      canvas.clear()
      let image = new fabric.Image(cropped)
      image.setCoords()
      canvas.add(image)
      canvas.setZoom(1)
      canvas.setWidth(image.width)
      canvas.setHeight(image.height)
      canvas.renderAll()
    }
  }
}

export default Crop
