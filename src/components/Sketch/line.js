/* eslint no-unused-vars: 0 */
/* eslint object-shorthand: 0 */
import { getUniqueId } from '@/utils/utils'
import FabricCanvasTool from './fabrictool'

const { fabric } = require('fabric')

// (function ($) {
//   console.log($)
//   $.Arrow = $.util.createClass($.Line, $.Observable, {
//     initialize: function (e, t) {
//       this.callSuper('initialize', e, t)
//       this.set({ type: 'arrow' })
//     },
//     _render: function (e) {
//       e.beginPath()
//       const r = this.calcLinePoints()
//       const headlen = 8 // length of head in pixels
//       const angle = Math.atan2(r.y2 - r.y1, r.x2 - r.x1)
//       e.moveTo(r.x1, r.y1)
//       e.lineTo(r.x2, r.y2)
//       e.lineTo(
//         r.x2 - headlen * Math.cos(angle - Math.PI / 6),
//         r.y2 - headlen * Math.sin(angle - Math.PI / 6),
//       )
//       e.moveTo(r.x2, r.y2)
//       e.lineTo(
//         r.x2 - headlen * Math.cos(angle + Math.PI / 6),
//         r.y2 - headlen * Math.sin(angle + Math.PI / 6),
//       )

//       e.lineWidth = this.strokeWidth
//       const s = e.strokeStyle
//       ;(e.strokeStyle = this.stroke || e.fillStyle),
//         this.stroke && this._renderStroke(e),
//         (e.strokeStyle = s)
//     },
//     complexity: function () {
//       return 2
//     },
//   })
//   $.Arrow.fromObject = function (e) {
//     const n = [
//       e.x1,
//       e.y1,
//       e.x2,
//       e.y2,
//     ]
//     return new $.Arrow(n, e)
//   }
// })(fabric)

const _FabricCalcArrowAngle = function (x1, y1, x2, y2) {
  let angle = 0

  let x

  let y
  x = x2 - x1
  y = y2 - y1
  if (x === 0) {
    angle = y === 0 ? 0 : y > 0 ? Math.PI / 2 : Math.PI * 3 / 2
  } else if (y === 0) {
    angle = x > 0 ? 0 : Math.PI
  } else {
    angle =
      x < 0
        ? Math.atan(y / x) + Math.PI
        : y < 0 ? Math.atan(y / x) + 2 * Math.PI : Math.atan(y / x)
  }
  return angle * 180 / Math.PI + 90
}

class Line extends FabricCanvasTool {
  configureCanvas (props) {
    let canvas = this._canvas
    canvas.isDrawingMode = canvas.selection = false
    canvas.forEachObject((o) => (o.selectable = o.evented = false))
    this._width = props.lineWidth
    this._color = props.lineColor
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
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      id: 'arrow_line',
      uuid: getUniqueId(),
      type: 'arrow',
    })

    let centerX = (this.line.x1 + this.line.x2) / 2
    let centerY = (this.line.y1 + this.line.y2) / 2
    this.deltaX = this.line.left - centerX
    this.deltaY = this.line.top - centerY

    this.triangle = new fabric.Triangle({
      left: this.line.get('x1') + this.deltaX,
      top: this.line.get('y1') + this.deltaY,
      originX: 'center',
      originY: 'center',
      selectable: false,
      // pointType: 'arrow_start',
      angle: -45,
      width: this._width * 5,
      height: this._width * 5,
      fill: this._color,
      id: 'arrow_triangle',
      uuid: this.line.uuid,
    })
    canvas.add(this.line, this.triangle)
  }

  doMouseMove (o) {
    if (!this.isDown) return
    let canvas = this._canvas
    let pointer = canvas.getPointer(o.e)
    this.line.set({ x2: pointer.x, y2: pointer.y })

    this.triangle.set({
      left: pointer.x + this.deltaX,
      top: pointer.y + this.deltaY,
      angle: _FabricCalcArrowAngle(
        this.line.x1,
        this.line.y1,
        this.line.x2,
        this.line.y2,
      ),
    })
    // this.line.setCoords()
    canvas.renderAll()
  }

  doMouseUp (o) {
    this.isDown = false
    let canvas = this._canvas
    let group = new window.fabric.Group(
      [
        this.line,
        this.triangle,
      ],
      {
        // borderColor: 'black',
        // cornerColor: 'green',
        lockScalingFlip: true,
        typeOfGroup: 'lineArrow',
        userLevel: 1,
        name: 'my_ArrowGroup',
        uuid: this.line.uuid,
        type: 'lineArrow',
        selectable: false,
      },
    )
    canvas.remove(this.line, this.triangle) // removing old object
    canvas.add(group)
  }

  doMouseOut (o) {
    // console.log('doMouseOut')
    // this.isDown = false
  }
}

export default Line
