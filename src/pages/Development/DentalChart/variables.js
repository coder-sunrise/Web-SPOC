import _ from 'lodash'
import clear from '@/assets/img/dentalChart/clear.png'
import missing from '@/assets/img/dentalChart/missing.png'
import caries from '@/assets/img/dentalChart/caries.png'
import recurrentdecay from '@/assets/img/dentalChart/recurrentdecay.png'
import nccl from '@/assets/img/dentalChart/nccl.png'
import fractured from '@/assets/img/dentalChart/fractured.png'
import filling from '@/assets/img/dentalChart/filling.png'
import temporarydressing from '@/assets/img/dentalChart/temporarydressing.png'
import onlayveneer from '@/assets/img/dentalChart/onlayveneer.png'
import test from '@/assets/img/dentalChart/test2.png'

const { fabric } = require('fabric')

const modifierNamePrefix = 'selected_'
export const cellPrefix = 'cell_'
export const selectablePrefix = 'selectable_'
// fabric.Object.prototype.set({
//   cornerSize: 0,
//   hasBorders: false,
//   lockMovementX: true,
//   lockMovementY: true,
//   lockRotation: true,
// })
fabric.Group.prototype.getLastAddedObject = function () {
  return this._objects[this._objects.length - 1]
}
fabric.Group.prototype.filter = function (f) {
  return this._objects.filter(f)
}
fabric.Group.prototype.object = function (name) {
  return this._objects.find((o) => o.name === name)
}
fabric.Object.prototype.isValidCell = function () {
  return this.name && this.name.indexOf(cellPrefix) === 0
}
fabric.Object.prototype.isDefaultCell = function () {
  return !this.name || this.name.indexOf(cellPrefix) === 0
}
export const strokeWidth = 2
export const baseWidth = 30
export const baseHeight = 40
export const zoom = 1
export const fontColor = '#000000'
export const innerFontSize = 22
export const lockConfig = {
  cornerSize: 0,
  hasBorders: false,
  lockMovementX: true,
  lockMovementY: true,
  lockRotation: true,
  // selectable: false,
}
export const groupCfg = {
  selectable: false,
}
const addonGroupCfg = {
  ...groupCfg,
  top: -baseHeight * 1.5 - strokeWidth / 2,
  left: -baseWidth * 2 - strokeWidth / 2,
}
export const sharedCfg = {
  selectable: false,
  strokeWidth,
  stroke: '#000000',
  objectCaching: true,
  strokeLineJoin: 'round',
  hoverCursor: 'pointer',
  fill: '#ffffff',
}

export const fontCfg = {
  selectable: false,
  fontFamily: 'Roboto',
  fill: fontColor,
  editable: false,
}
export const overlayShapeTypes = [
  'onlayveneer',
  'clear',
  'fractured',
  'bridge',
  'missing',
]
const checkIsValidElement = (item, name, checker) => {
  if (checker) return checker(item, name)
  if (item.name === name) {
    return true
  }
  if (
    item.getObjects &&
    item.getObjects &&
    item.getObjects().filter((n) => n.name && n.name === name).length > 0
  ) {
    return true
  }
  return false
}
const debouncedAction = _.debounce(
  (cb) => {
    cb()
  },
  100,
  {
    leading: true,
    trailing: false,
  },
)
const makeLine = (coords, cfg) => {
  return new fabric.Line(coords, {
    fill: 'red',
    stroke: 'red',
    strokeWidth: 6,
    selectable: false,
    evented: false,
    ...cfg,
  })
}
const makeCircle = (cfg) => {
  return new fabric.Circle({
    left: -8,
    top: -8,
    strokeWidth: 2,
    radius: 8,
    fill: '#fff',
    stroke: '#666',
    ...cfg,
  })
}
let currentSelectedStyle = null
let currentSelectedGroup = null
const renderBackgroud = () => {
  return new fabric.Rect({
    ...sharedCfg,
    width: baseWidth * 4,
    height: baseHeight * 3,
    name: 'replaceObject',
    fill: '#ffffff',
    opacity: 1,
  })
}
let currentPointer
const toggleSelect = ({ item, selected, config, values, dispatch, group }) => {
  debouncedAction(() => {
    // console.log(config, selected, values, item.name)

    const currentSelctedValue = selected.find(
      (o) => o.value === config.value && (o.target === item.name || !o.target),
    )
    dispatch({
      type: 'dentalChartComponent/toggleSelect',
      payload: {
        ...config,
        ...currentSelctedValue,
        toothIndex: Number(group.name),
        target: item.name,
        prevColor: item.isValidCell() ? item.item(0).fill : '',
      },
    })

    // if (currentSelctedValue) {
    //   item.set('opacity', unselectedOpactiy || 0.1)
    //   item.set('fill', 'white')
    //   if (shape) group.sendToBack(item)
    // } else {
    //   item.set('opacity', 1)
    //   if (shape) group.bringToFront(item)
    // }

    // item.set('fill', config.fill)

    // canvas.renderAll()
  })
}
const renderOutsideTopCell = (
  {
    addonShapeHandler,
    customizeHover = false,
    unselectedOpactiy = 0,
    ...config
  },
  { canvas, group, dispatch, values = [] },
) => {
  console.log(config, values)
  const { value } = config

  let selected = values.filter((o) => o.value === value)
  // if (
  //   overlayShapeTypes.includes(value) &&
  //   values.find((o) => o.value !== value)
  // ) {
  //   dispatch()
  // }
  const name = `${modifierNamePrefix}${value}`
  const shape =
    typeof addonShapeHandler === 'function'
      ? addonShapeHandler({ selected, config })
      : undefined
  group.off('mouseup')

  group.on('mouseup', (e) => {
    console.log('gesture', e)
    if (e.target) {
      const item = group.object(value)

      if (
        item // &&
        // e.target.canvas // &&
        // checkIsValidElement(item, name, config.isValidElement)
      ) {
        toggleSelect({ item, selected, config, values, dispatch, group })
      }
    }
  })
  console.log(shape)

  if (shape) {
    if (group.filter((o) => o.name === name).length === 0) {
      shape.set('name', name)
      group.add(shape)
      // if (selected.length === 0) shape.sendToBack()
    } else {
      // console.log(group.filter((o) => o.name === name))
      group.filter((o) => o.name === name)[0].bringToFront()
    }
  }
  console.log(selected)
  // const group = new fabric.Group(
  //   [
  //     shape,
  //   ],
  //   {
  //     ...groupCfg,
  //     name: 'selectedGroup',
  //   },
  // )
  // canvas.off('mouse:over')
  // canvas.off('mouse:out')
  // canvas.off('mouse:up')
  group.off('mouseover')
  group.off('mouseout')
  // if (selected.length === 0) {

  // }
  if (
    [
      'topcell',
      'bottomcell',
    ].includes(config.value)
  ) {
    group.on('mouseover', (e) => {
      console.log(e)
      if (selected.length === 0) {
        group.object(value).set('opacity', 1)
        canvas.renderAll()
      }
    })
    group.on('mouseout', (e) => {
      if (selected.length === 0) {
        group.object(value).set('opacity', unselectedOpactiy)
        canvas.renderAll()
      }
    })

    // canvas.on('mouse:over', (e) => {
    //   if (e.target) {
    //     const item = e.target

    //     if (item && item.name === name && selected.length === 0) {
    //       item.set('opacity', 1)
    //       item.set('fill', config.fill)

    //       canvas.renderAll()
    //     }
    //   }
    // })
    // canvas.on('mouse:out', (e) => {
    //   if (e.target) {
    //     const item = e.target
    //     if (item && item.name === name && selected.length === 0) {
    //       item.set('opacity', 0.1)
    //       item.set('fill', config.fill)

    //       canvas.renderAll()
    //     }
    //   }
    // })
  } else if (
    [
      'temporarydressing',
    ].includes(config.value)
  ) {
    // console.log(selected, config)
    group._objects.filter((o) => o.isValidCell()).map((sub) => {
      sub.off('mouseup')
      sub.on('mouseup', (e) => {
        console.log(e.subTargets[0])
        if (
          e.subTargets[0] instanceof fabric.Group &&
          e.subTargets[0].isValidCell()
        ) {
          toggleSelect({
            item: e.subTargets[0],
            selected,
            config,
            values,
            dispatch,
            group,
          })
        }
      })
      sub.on('dragover', (e) => {
        console.log('dragenter', e)
      })

      if (selected.find((o) => o.target === sub.name)) {
        sub.item(0).set('fill', config.fill)
      } else {
        sub.item(0).set('fill', 'white')

        sub.off('mouseover')
        sub.off('mouseout')

        let prevColor = null
        sub.on('mouseover', (e) => {
          if (e.target instanceof fabric.Group && e.target.isValidCell()) {
            const item = e.target.item(0)
            prevColor = item.get('fill')
            e.target.item(0).set('fill', config.fill)
            canvas.renderAll()
          }
        })
        sub.on('mouseout', (e) => {
          if (e.target instanceof fabric.Group && e.target.isValidCell()) {
            e.target.item(0).set('fill', prevColor)
            canvas.renderAll()
          }
        })
      }
    })

    group.on('mouseout', (e) => {
      group._objects.map((sub) => {
        if (sub instanceof fabric.Group && sub.isValidCell()) {
          if (!selected.find((o) => o.target === sub.name)) {
            sub.item(0).set('fill', 'white')
            canvas.renderAll()
          }
        }
      })
      canvas.renderAll()
    })
    // group.on('mouseover', (e) => {
    //   console.log(e)
    //   if (selected.length === 0) {
    //     // group.object(value).set('opacity', 1)
    //     canvas.renderAll()
    //   }
    // })
    // group.on('mouseout', (e) => {
    //   if (selected.length === 0) {
    //     // group.object(value).set('opacity', unselectedOpactiy)
    //     canvas.renderAll()
    //   }
    // })

    // canvas
    //   .getObjects()
    //   .filter((o) => o.name && o.name.indexOf(cellPrefix) === 0)
    //   .map((g) => {
    //     const item = g.item(0)
    //     if (item) {
    //       if (selected.find((m) => g.name === m.target)) {
    //         item.set('fill', config.fill)
    //       } else {
    //         item.set('fill', `white`)
    //       }
    //     }
    //   })

    // let colorBefore = null
    // canvas.on('mouse:over', (e) => {
    //   // console.log(e, e.target)
    //   if (e.target && e.target.item) {
    //     const item = e.target.item(0)

    //     if (item && !selected.find((o) => o.target === e.target.name)) {
    //       colorBefore = item.get('fill')
    //       item.set('fill', config.fill)
    //       // canvas.getObjects('group').map((o) => {
    //       //   if (o.name && o.name.indexOf(cellPrefix) === 0) o.set('opacity', 1)
    //       // })
    //       canvas.renderAll()
    //     }
    //   }
    // })

    // canvas.on('mouse:out', (e) => {
    //   if (e.target && e.target.item) {
    //     const item = e.target.item(0)
    //     if (item && !selected.find((o) => o.target === e.target.name)) {
    //       item.set('fill', colorBefore || 'white')
    //       // canvas.getObjects('group').map((o) => {
    //       //   if (o.name && o.name.indexOf(cellPrefix) === 0) o.set('opacity', 0.1)
    //       // })

    //       canvas.renderAll()
    //     }
    //   }
    // })
  } else if (overlayShapeTypes.includes(value)) {
    // group.on('mouseover', (e) => {
    //   if (selected.length === 0) {
    //     group.object(value).set('opacity', 1)
    //     canvas.renderAll()
    //   }
    // })
    // group.on('mouseout', (e) => {
    //   if (selected.length === 0) {
    //     group.object(value).set('opacity', unselectedOpactiy)
    //     canvas.renderAll()
    //   }
    // })
  }

  const item = group.object(value)
  if (item) {
    if (selected.length === 0) {
      group.sendToBack(item)
      item.set('opacity', unselectedOpactiy)
    } else {
      group.bringToFront(item)
      item.set('opacity', 1)
    }
  }

  const existOverlay = group.object(
    values.find((o) => overlayShapeTypes.includes(o.value)),
  )

  if (existOverlay) {
    existOverlay.set('opacity', 1)
    existOverlay.bringToFront()
  }
}
const sharedButtonConfig = {
  clear: ({ canvas, group, values = [] }) => {
    // canvas.remove()
    console.log('clear', group.filter((o) => !o.isDefaultCell()))
    // console.log(
    //   group.filter((o) => !o.isDefaultCell),
    //   group._objects.filter((o) => !o.isDefaultCell),
    //   group._objects.filter((o) => {
    //     console.log(o)
    //     return !o.name || o.name.indexOf(cellPrefix) === 0
    //   }),
    // )
    group.filter((o) => !o.isDefaultCell()).map((sub) => {
      // sub.sendToBack()
    })
    // console.log(values)
    // canvas
    //   .getObjects('group')
    //   .filter((o) => {
    //     console.log('group', o, values)
    //     if (!o.name || o.name.indexOf(modifierNamePrefix) < 0) return false
    //     if (
    //       values.find(
    //         (m) => o.name && o.name.replace(modifierNamePrefix, '') === m.value,
    //       )
    //     )
    //       return false
    //     if (
    //       o.getObjects &&
    //       values.find(
    //         (m) =>
    //           o
    //             .getObjects()
    //             .filter(
    //               (n) =>
    //                 n.name &&
    //                 n.name.replace(modifierNamePrefix, '') === m.value,
    //             ).length > 0,
    //       )
    //     ) {
    //       return false
    //     }

    //     // if(canvas.name, value.toothIndex)
    //     console.log(o, canvas.name, values)
    //     return true
    //   })
    //   .map((o) => {
    //     console.log(o)
    //     canvas.remove(o)
    //   })
  },
}

let img1

fabric.Image.fromURL(test, (img) => {
  // console.log(
  //   (img.height - strokeWidth * 2) / (baseHeight * 3),
  //   baseHeight * 3 / img.height,
  //   img.height,
  //   baseHeight * 3,
  // )
  const img2 = img
    .set({ left: 0, top: 0 })
    .scale((baseHeight * 3 + strokeWidth * 2) / img.height)
  const group = new fabric.Group(
    [
      img2,
    ],
    {
      ...addonGroupCfg,
    },
  )
  // img2.set('scaleX', 1)
  // img2.set('scaleY', 1)

  // group.setZoom(0.5)
  img1 = group
})

export const buttonConfigs = [
  {
    id: 1,
    value: 'clear',
    icon: clear,
    text: 'Clear',
    fixed: true,
    method: 'na',
  },
  {
    id: 2,
    value: 'missing',
    icon: missing,
    text: 'Missing',
    getShape: ({ canvas, group, config }) => {
      const g = new fabric.Group(
        [
          renderBackgroud(),
        ],
        {
          ...addonGroupCfg,
        },
      )
      return g
    },
    fixed: true,
    method: 'na',
  },
  {
    id: 3,
    value: 'caries',
    icon: caries,
    text: 'Caries',
    type: 'cell',
    fill: '#824f4f',
    method: 'surface',
  },
  {
    id: 4,
    value: 'recurrentdecay',
    icon: recurrentdecay,
    text: 'Recurrent Decay',
    type: 'cell',
    fill: '#f79e02',
    method: 'surface',
  },
  {
    id: 5,
    value: 'nccl',
    icon: nccl,
    text: 'NCCL',
    type: 'cell',
    fill: '#ffe921',
    method: 'surface',
  },
  {
    id: 6,
    value: 'fractured',
    icon: test,
    text: 'Fractured',
    getShape: ({ canvas, group, config }) => {
      return fabric.util.object.clone(img1)
    },
    method: 'tooth',
  },
  {
    id: 7,
    value: 'filling',
    icon: filling,
    text: 'Filling',
    type: 'cell',
    fill: '#737372',
    method: 'surface',
  },
  {
    id: 8,
    value: 'temporarydressing',
    icon: temporarydressing,
    text: 'Temporary Dressing',
    type: 'cell',
    fill: '#9c9c98',
    method: 'surface',
  },
  {
    id: 9,
    value: 'onlayveneer',
    icon: onlayveneer,
    text: 'Onlay/Veneer',
    ...sharedButtonConfig,
    getShape: () => {
      const onlayveneerInner1 = new fabric.Triangle({
        top: 5,
        left: baseWidth * 0.5 / 2 + 5,
        width: baseWidth * 3.5 - 10,
        height: baseHeight * 3 - 10,
        // top: baseHeight * 2 + 5,
        ...sharedCfg,
        fill: '#cccccc',
      })
      const onlayveneerInner2 = new fabric.Triangle({
        top: baseHeight + 5,
        left: baseWidth / 2 + 15,
        width: baseWidth * 2,
        height: baseHeight * 2 - 10,
        // top: baseHeight * 3 + 5,
        ...sharedCfg,
        fill: '#ffffff',
      })
      onlayveneerInner1.rotate(180)
      onlayveneerInner2.rotate(180)
      const group = new fabric.Group(
        [
          renderBackgroud(),
          onlayveneerInner1,
          onlayveneerInner2,
        ],
        {
          ...addonGroupCfg,
        },
      )
      return group
    },
    method: 'tooth',
  },
  {
    id: 10,
    value: 'bridge',
    // icon: filling,
    text: 'Bridge',
    type: 'connect',
    // fill: '#737372',
    getShape: () => {
      let line = makeLine([
        0,
        -3,
        baseWidth * 2 + strokeWidth / 2,
        -3,
      ])
      let line2 = makeLine([
        0,
        -3,
        -baseWidth * 2 - strokeWidth / 2,
        -3,
      ])

      let c = makeCircle({
        left: -8,
        top: -8,
      })
      // c.hasControls = c.hasBorders = false

      c.line1 = line
      c.line2 = line2

      const groupConnect = new fabric.Group(
        [
          line,
          line2,
          c,
        ],
        {
          ...groupCfg,
          name: `bridge`,
          disableAutoReplace: true,
        },
      )
      return groupConnect
    },

    onSelect: ({ canvas }) => {
      // let startTarget
      // let endTarget
      // let started = false
      // let line = null
      // let selected = []
      // canvas.set('selection', false)
      // canvas.getObjects('group').map((o) => {
      //   o.set('selectable', false)
      //   // o.set('selectable', false)
      //   const _anchor = makeCircle({
      //     left: 0,
      //     top: 0,
      //     selectable: true,
      //     name: `${selectablePrefix}_${o.name}_anchor`,
      //     ...lockConfig,
      //     lockMovementX: false,
      //   })
      //   console.log('add anchor', _anchor)
      //   o.add(_anchor)
      //   // canvas.setActiveObject(_anchor, e)
      //   // canvas.bringToFront(_anchor)
      //   console.log(o)
      //   canvas.renderAll()
      //   // canvas.sendToBack(o)
      // })
      // canvas.off('mouse:down')
      // canvas.on('mouse:down', (e) => {
      //   started = true
      //   startTarget = e.target
      //   console.log(e)
      //   // const anchor = canvas._objects.find(
      //   //   (o) => o.name === `${selectablePrefix}anchor`,
      //   // )
      //   // if (anchor) {
      //   //   // canvas.setActiveObject(anchor, e)
      //   //   anchor.set('left', e.pointer.x)
      //   //   anchor.setCoords()
      //   //   canvas.renderAll()
      //   // }
      //   if (!line && e.target) {
      //     // line = makeLine(
      //     //   [
      //     //     e.pointer.x,
      //     //     e.pointer.y,
      //     //     e.pointer.x,
      //     //     e.pointer.y,
      //     //   ],
      //     //   {
      //     //     lockMovementX: true,
      //     //   },
      //     // )
      //     // canvas.add(line)
      //   }
      // })
      // canvas.off('mouse:up')
      // canvas.on('mouse:up', (e) => {
      //   started = false
      //   endTarget = e.target
      //   console.log(e)
      //   console.log(startTarget, endTarget)
      // })
      // canvas.off('object:moving')
      // canvas.on('object:moving', (e) => {
      //   console.log('object:moving', e)
      //   const anchor = canvas._objects.find(
      //     (o) => o.name === `${selectablePrefix}anchor`,
      //   )
      //   if (anchor) {
      //     if (!selected.find((o) => o === e.target.name)) {
      //       // selected.
      //     }
      //     // canvas.setActiveObject(anchor, e)
      //     anchor.set('left', e.pointer.x)
      //     anchor.setCoords()
      //     canvas.renderAll()
      //   }
      // })
      // canvas.off('mouse:move')
      // canvas.on('mouse:move', (e) => {
      //   if (started) {
      //     const anchor = canvas._objects.find(
      //       (o) => o.name === `${selectablePrefix}anchor`,
      //     )
      //     if (anchor) {
      //       console.log('mouse:move', e)
      //       // canvas.setActiveObject(anchor, e)
      //       anchor.set('left', e.pointer.x)
      //       anchor.setCoords()
      //       canvas.renderAll()
      //     }
      //   }
      // })
      // canvas.off('mouse:over')
      // canvas.on('mouse:over', (e) => {
      //   if (e.target) {
      //     const anchor = canvas._objects.find(
      //       (o) => o.name === `${selectablePrefix}anchor`,
      //     )
      //     if (anchor && !started) {
      //       // console.log(11)
      //       // anchor.set({
      //       //   left: e.target.left + e.target.width / 2 - 8,
      //       //   top: e.target.top + e.target.height / 2 - 8,
      //       // })
      //       // // canvas.setActiveObject(anchor, e)
      //       // canvas.bringToFront(anchor)
      //       // canvas.renderAll()
      //     } else if (
      //       !canvas._objects.find((o) => o.name === `${selectablePrefix}anchor`)
      //     ) {
      //       console.log(22)
      //       // const _anchor = makeCircle({
      //       //   left: e.target.left + e.target.width / 2 - 8,
      //       //   top: e.target.top + e.target.height / 2 - 8,
      //       //   selectable: true,
      //       //   name: `${selectablePrefix}anchor`,
      //       //   ...lockConfig,
      //       //   lockMovementX: false,
      //       // })
      //       // console.log('add anchor', _anchor)
      //       // canvas.add(_anchor)
      //       // // canvas.setActiveObject(_anchor, e)
      //       // canvas.bringToFront(_anchor)
      //       // canvas.renderAll()
      //     }
      //   }
      // })
    },
    onDeselect: ({ canvas }) => {
      canvas.set('selection', true)

      canvas.getObjects('group').map((o) => {
        o.set('selectable', true)
      })
    },
    method: 'tooth',
  },
  // {
  //   value: 'topcell',
  //   // icon: onlayveneer,
  //   text: 'Top',
  //   color: 'brown',
  //   type: 'special',
  //   ...sharedButtonConfig,
  //   onSelect: ({ canvas }) => {},
  // },

  // {
  //   value: 'bottomcell',
  //   // icon: onlayveneer,
  //   text: 'Bottom',
  //   color: 'brown',
  //   type: 'special',

  //   ...sharedButtonConfig,
  // },
]
