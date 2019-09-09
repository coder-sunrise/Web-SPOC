// import FabricCanvasTool from './fabrictool'

// const fabric = require('fabric').fabric

// class Eraser extends FabricCanvasTool {
//   configureCanvas (props) {
//     //   let canvas = this._canvas;
//     //   //canvas.isDrawingMode = canvas.selection = false

//     //   var context = canvas.getContext("2d");
//     //   this._width = props.lineWidth
//     //   this._color = "#FFFFFF"
//     //   context.strokeStyle = "#FFFFFF";
//     let canvas = this._canvas
//     canvas.forEachObject((o) => ((o.selectable = o.evented = false)))
//     this.context = canvas.getContext('2d')

//     // canvas.on('path:created', function (opt) {
//     //   opt.path.globalCompositeOperation = 'destination-out'
//     //   opt.path.lineWidth = 10
//     //   opt.path.stroke = 'rgba(0,0,0,0)'
//     //   //opt.path.fill = 'black';
//     //   canvas.requestRenderAll()
//     // })
//   }

//   doMouseDown (o) {
//     this.isDown = true
//   }

//   doMouseMove (o) {

//     let canvas = this._canvas
//     if (this.isDown) {
//         canvas.on('path:created', function (opt) {
//         opt.path.globalCompositeOperation = 'destination-out'
//         opt.path.lineWidth = 10
//         opt.path.stroke = 'rgba(0,0,0,0)'
//         //opt.path.fill = 'black';
//         canvas.requestRenderAll()
//       })

//     }
//   }

//   doMouseUp (o) {
//     this.isDown = false
//   }

//   doMouseOut (o) {
//     this.isDown = false
//   }
// }

// export default Eraser

import FabricCanvasTool from './fabrictool'

class Eraser extends FabricCanvasTool {
  configureCanvas () {
    let canvas = this._canvas
    canvas.isDrawingMode = false
    canvas.selection = true
    canvas.forEachObject((o) => {
      o.selectable = true
      o.evented = true 
    })
    canvas.defaultCursor = 'cell'
  }

  doMouseDown () {

    let canvas = this._canvas
    this.isDown = true
    let obj = canvas.getActiveObject()
    if(obj){
      obj.set({
        id: "delete",
      })
      canvas.remove(obj)
    }
   
  }


  doMouseUp () {
    let canvas = this._canvas
    this.isDown = false
    let obj = canvas.getActiveObject()
    if(obj){
      obj.set({
        id: "delete",
      })
      canvas.remove(obj)
    }
  }
}

export default Eraser
