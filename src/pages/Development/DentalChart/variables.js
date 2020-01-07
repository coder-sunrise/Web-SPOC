import _ from 'lodash'
import color from '@material-ui/core/colors/amber'
import { Row } from 'antd'
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
  return (
    !this.name ||
    this.name.indexOf(cellPrefix) === 0 ||
    this.name.indexOf('header_') === 0
  )
}

export const strokeWidth = 2
export const baseWidth = 30
export const baseHeight = 40
export const groupWidth = baseWidth * 4 // + strokeWidth
export const groupHeight = baseHeight * 3 // + strokeWidth
export const zoom = 1
export const fontColor = '#000000'
export const innerFontSize = 22
export const lockConfig = {
  // cornerSize: 0,
  // hasBorders: false,
  // lockMovementX: true,
  // lockMovementY: true,
  // lockRotation: true,
  // selectable: false,
}
export const groupCfg = {
  // selectable: false,
}
export const addonGroupCfg = {
  ...groupCfg,
  top: -baseHeight * 1.5 - strokeWidth / 2,
  left: -baseWidth * 2 - strokeWidth / 2,
}
export const sharedCfg = {
  // selectable: false,
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
const imageCache = {}
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
export const createLine = (coords, cfg) => {
  return new fabric.Line(coords, {
    fill: 'red',
    stroke: 'red',
    strokeWidth: 6,
    selectable: false,
    evented: false,
    ...cfg,
  })
}
export const createCircle = (cfg) => {
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
// let currentSelectedStyle = null
// let currentSelectedGroup = null
export const createRectangle = (cfg) => {
  return new fabric.Rect({
    ...sharedCfg,
    width: baseWidth * 4,
    height: baseHeight * 3,
    name: 'replaceObject',
    fill: '#ffffff',
    opacity: 1,
    ...cfg,
  })
}
// let currentPointer
// const toggleSelect = ({ item, selected, config, values, dispatch, group }) => {
//   debouncedAction(() => {
//     // console.log(config, selected, values, item.name)

//     const currentSelctedValue = selected.find(
//       (o) => o.value === config.value && (o.target === item.name || !o.target),
//     )
//     dispatch({
//       type: 'dentalChartComponent/toggleSelect',
//       payload: {
//         ...config,
//         ...currentSelctedValue,
//         toothIndex: Number(group.name),
//         target: item.name,
//         prevColor: item.isValidCell() ? item.item(0).fill : '',
//       },
//     })

//     // if (currentSelctedValue) {
//     //   item.set('opacity', unselectedOpactiy || 0.1)
//     //   item.set('fill', 'white')
//     //   if (shape) group.sendToBack(item)
//     // } else {
//     //   item.set('opacity', 1)
//     //   if (shape) group.bringToFront(item)
//     // }

//     // item.set('fill', config.fill)

//     // canvas.renderAll()
//   })
// }
// const renderOutsideTopCell = (
//   {
//     addonShapeHandler,
//     customizeHover = false,
//     unselectedOpactiy = 0,
//     ...config
//   },
//   { canvas, group, dispatch, values = [] },
// ) => {
//   console.log(config, values)
//   const { value } = config

//   let selected = values.filter((o) => o.value === value)
//   // if (
//   //   overlayShapeTypes.includes(value) &&
//   //   values.find((o) => o.value !== value)
//   // ) {
//   //   dispatch()
//   // }
//   const name = `${modifierNamePrefix}${value}`
//   const shape =
//     typeof addonShapeHandler === 'function'
//       ? addonShapeHandler({ selected, config })
//       : undefined
//   group.off('mouseup')

//   group.on('mouseup', (e) => {
//     console.log('gesture', e)
//     if (e.target) {
//       const item = group.object(value)

//       if (
//         item // &&
//         // e.target.canvas // &&
//         // checkIsValidElement(item, name, config.isValidElement)
//       ) {
//         toggleSelect({ item, selected, config, values, dispatch, group })
//       }
//     }
//   })
//   // console.log(shape)

//   if (shape) {
//     if (group.filter((o) => o.name === name).length === 0) {
//       shape.set('name', name)
//       group.add(shape)
//       // if (selected.length === 0) shape.sendToBack()
//     } else {
//       // console.log(group.filter((o) => o.name === name))
//       group.filter((o) => o.name === name)[0].bringToFront()
//     }
//   }
//   console.log(selected)
//   // const group = new fabric.Group(
//   //   [
//   //     shape,
//   //   ],
//   //   {
//   //     ...groupCfg,
//   //     name: 'selectedGroup',
//   //   },
//   // )
//   // canvas.off('mouse:over')
//   // canvas.off('mouse:out')
//   // canvas.off('mouse:up')
//   group.off('mouseover')
//   group.off('mouseout')
//   // if (selected.length === 0) {

//   // }
//   if (
//     [
//       'topcell',
//       'bottomcell',
//     ].includes(config.value)
//   ) {
//     group.on('mouseover', (e) => {
//       console.log(e)
//       if (selected.length === 0) {
//         group.object(value).set('opacity', 1)
//         canvas.renderAll()
//       }
//     })
//     group.on('mouseout', (e) => {
//       if (selected.length === 0) {
//         group.object(value).set('opacity', unselectedOpactiy)
//         canvas.renderAll()
//       }
//     })

//     // canvas.on('mouse:over', (e) => {
//     //   if (e.target) {
//     //     const item = e.target

//     //     if (item && item.name === name && selected.length === 0) {
//     //       item.set('opacity', 1)
//     //       item.set('fill', config.fill)

//     //       canvas.renderAll()
//     //     }
//     //   }
//     // })
//     // canvas.on('mouse:out', (e) => {
//     //   if (e.target) {
//     //     const item = e.target
//     //     if (item && item.name === name && selected.length === 0) {
//     //       item.set('opacity', 0.1)
//     //       item.set('fill', config.fill)

//     //       canvas.renderAll()
//     //     }
//     //   }
//     // })
//   } else if (
//     [
//       'temporarydressing',
//     ].includes(config.value)
//   ) {
//     // console.log(selected, config)
//     group._objects.filter((o) => o.isValidCell()).map((sub) => {
//       sub.off('mouseup')
//       sub.on('mouseup', (e) => {
//         console.log(e.subTargets[0])
//         if (
//           e.subTargets[0] instanceof fabric.Group &&
//           e.subTargets[0].isValidCell()
//         ) {
//           toggleSelect({
//             item: e.subTargets[0],
//             selected,
//             config,
//             values,
//             dispatch,
//             group,
//           })
//         }
//       })
//       sub.on('dragover', (e) => {
//         console.log('dragenter', e)
//       })

//       if (selected.find((o) => o.target === sub.name)) {
//         sub.item(0).set('fill', config.fill)
//       } else {
//         sub.item(0).set('fill', 'white')

//         sub.off('mouseover')
//         sub.off('mouseout')

//         let prevColor = null
//         sub.on('mouseover', (e) => {
//           if (e.target instanceof fabric.Group && e.target.isValidCell()) {
//             const item = e.target.item(0)
//             prevColor = item.get('fill')
//             e.target.item(0).set('fill', config.fill)
//             canvas.renderAll()
//           }
//         })
//         sub.on('mouseout', (e) => {
//           if (e.target instanceof fabric.Group && e.target.isValidCell()) {
//             e.target.item(0).set('fill', prevColor)
//             canvas.renderAll()
//           }
//         })
//       }
//     })

//     group.on('mouseout', (e) => {
//       group._objects.map((sub) => {
//         if (sub instanceof fabric.Group && sub.isValidCell()) {
//           if (!selected.find((o) => o.target === sub.name)) {
//             sub.item(0).set('fill', 'white')
//             canvas.renderAll()
//           }
//         }
//       })
//       canvas.renderAll()
//     })
//     // group.on('mouseover', (e) => {
//     //   console.log(e)
//     //   if (selected.length === 0) {
//     //     // group.object(value).set('opacity', 1)
//     //     canvas.renderAll()
//     //   }
//     // })
//     // group.on('mouseout', (e) => {
//     //   if (selected.length === 0) {
//     //     // group.object(value).set('opacity', unselectedOpactiy)
//     //     canvas.renderAll()
//     //   }
//     // })

//     // canvas
//     //   .getObjects()
//     //   .filter((o) => o.name && o.name.indexOf(cellPrefix) === 0)
//     //   .map((g) => {
//     //     const item = g.item(0)
//     //     if (item) {
//     //       if (selected.find((m) => g.name === m.target)) {
//     //         item.set('fill', config.fill)
//     //       } else {
//     //         item.set('fill', `white`)
//     //       }
//     //     }
//     //   })

//     // let colorBefore = null
//     // canvas.on('mouse:over', (e) => {
//     //   // console.log(e, e.target)
//     //   if (e.target && e.target.item) {
//     //     const item = e.target.item(0)

//     //     if (item && !selected.find((o) => o.target === e.target.name)) {
//     //       colorBefore = item.get('fill')
//     //       item.set('fill', config.fill)
//     //       // canvas.getObjects('group').map((o) => {
//     //       //   if (o.name && o.name.indexOf(cellPrefix) === 0) o.set('opacity', 1)
//     //       // })
//     //       canvas.renderAll()
//     //     }
//     //   }
//     // })

//     // canvas.on('mouse:out', (e) => {
//     //   if (e.target && e.target.item) {
//     //     const item = e.target.item(0)
//     //     if (item && !selected.find((o) => o.target === e.target.name)) {
//     //       item.set('fill', colorBefore || 'white')
//     //       // canvas.getObjects('group').map((o) => {
//     //       //   if (o.name && o.name.indexOf(cellPrefix) === 0) o.set('opacity', 0.1)
//     //       // })

//     //       canvas.renderAll()
//     //     }
//     //   }
//     // })
//   } else if (overlayShapeTypes.includes(value)) {
//     // group.on('mouseover', (e) => {
//     //   if (selected.length === 0) {
//     //     group.object(value).set('opacity', 1)
//     //     canvas.renderAll()
//     //   }
//     // })
//     // group.on('mouseout', (e) => {
//     //   if (selected.length === 0) {
//     //     group.object(value).set('opacity', unselectedOpactiy)
//     //     canvas.renderAll()
//     //   }
//     // })
//   }

//   const item = group.object(value)
//   if (item) {
//     if (selected.length === 0) {
//       group.sendToBack(item)
//       item.set('opacity', unselectedOpactiy)
//     } else {
//       group.bringToFront(item)
//       item.set('opacity', 1)
//     }
//   }

//   const existOverlay = group.object(
//     values.find((o) => overlayShapeTypes.includes(o.value)),
//   )

//   if (existOverlay) {
//     existOverlay.set('opacity', 1)
//     existOverlay.bringToFront()
//   }
// }
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

export const buttonConfigs = [
  {
    id: 1,
    value: 'clear',
    text: 'Clear',
    fixed: true,
    method: 'na',
    isDiagnosis: true,
  },
  {
    id: 2,
    value: 'missing',
    text: 'Missing',
    fill: 'white',
    fixed: true,
    method: 'na',
    isDiagnosis: true,
    editMode: 'color',
    symbol: '',
  },
  {
    id: 3,
    value: 'caries',
    text: 'Caries',
    type: 'cell',
    fill: '#824f4f',
    method: 'surface',
  },
  {
    id: 4,
    value: 'recurrentdecay',
    text: 'Recurrent Decay',
    type: 'cell',
    fill: '#f79e02',
    method: 'surface',
  },
  {
    id: 5,
    value: 'nccl',
    text: 'NCCL',
    type: 'cell',
    fill: '#ffe921',
    method: 'surface',
  },
  {
    id: 6,
    value: 'fractured',
    text: 'Fractured',

    method: 'tooth',
  },
  {
    id: 7,
    value: 'filling',
    text: 'Filling',
    type: 'cell',
    fill: '#737372',
    method: 'surface',
  },
  {
    id: 8,
    value: 'temporarydressing',
    text: 'Temporary Dressing',
    type: 'cell',
    fill: '#9c9c98',
    method: 'surface',
  },
  {
    id: 9,
    value: 'onlayveneer',
    text: 'Onlay/Veneer',
    ...sharedButtonConfig,

    method: 'tooth',
  },
  {
    id: 10,
    value: 'bridge',
    // icon: filling,
    text: 'Bridge',
    type: 'connect',

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
export const createFont = ({ text, ...restProps }) => {
  return new fabric.IText(text || '', {
    fontSize: innerFontSize,
    ...fontCfg,
    ...restProps,
  })
}
export const createToothShape = ({
  text = {},
  fill = {},
  symbol = {},
  index,
  width,
  height,
  order = 0,
  left = 0,
  line = 0,
  posAjustTop = 0,
  paddingLeft = 30,
  paddingTop = 20,
  custom,
  image,
  canvas,
  action,
}) => {
  // console.log(action)
  const cfg = {
    ...sharedCfg,
    top: baseHeight * 2,
    // strokeUniform: true,
  }

  // if (symbol) {
  //   // fixedItems.push(g5)
  // }
  // console.log(fixedItems)
  const cCfg = {
    ...groupCfg,
    ...lockConfig,

    width: width || groupWidth,
    height: height || groupHeight,
    // padding: 300,
    left: (order + left) * groupWidth + paddingLeft,
    top: groupHeight * line + paddingTop + posAjustTop,
    // originX: 'left',
    index,
    // originY: 'center',
    subTargetCheck: true,
    selectable: false,
    selectionBackgroundColor: '#cccccc',
    line,
    // opacity: 0,
    // transparentCorners: true,
    // cornerColor: 'white',

    // padding: 20,
    // cornerStrokeColor: 'black',
    // cornerStyle: 'circle',
  }
  if (index) {
    cCfg.name = `${index}`
  }
  const _width = width || groupWidth
  const _height = height || groupHeight
  // if (custom) {
  //   console.log(custom)
  //   return new fabric.Group(
  //     [
  //       typeof custom === 'function' ? custom() : custom,
  //     ],
  //     cCfg,
  //   )
  // }
  if (action && action.method === 'tooth' && !image) {
    // console.log(fill, symbol)
    return new fabric.Group(
      [
        createRectangle({
          fill: action.fill,
        }),
        createFont({
          text: action.symbol,
          left: _width / 2 - _width / 8,
          top: _height / 2 - _height / 4,
          fontSize: _width / 2,
        }),
      ],
      {
        ...groupCfg,
        isShape: true,
      },
    )
  }
  if (image) {
    const data = image[0] || image
    const { thumbnailData, content } = data
    if (imageCache[action.value]) return imageCache[action.value]
    fabric.Image.fromURL(thumbnailData, (img) => {
      imageCache[action.value] = new fabric.Group(
        [
          img.set({
            left: 0,
            top: 0,
            width: width || groupWidth,
            height: height || groupHeight,
          }),
          // .scale((width || groupWidth) / img.width),
        ],
        {
          ...groupCfg,
          isShape: true,
        },
      )

      canvas.add(imageCache[action.value])
    })
    return
  }
  const polygon = new fabric.Polygon( // left
    [
      { x: 0, y: 0 },
      { x: 0, y: baseHeight * 3 },
      { x: baseWidth, y: baseHeight * 2 },
      { x: baseWidth, y: baseHeight },
    ],
    {
      ...cfg,
      name: text.left,
      fill: fill.left || 'white',
    },
  )

  const polygon2 = new fabric.Polygon( // bottom
    [
      { x: baseWidth, y: baseHeight * 2 },
      { x: 0, y: baseHeight * 3 },
      { x: baseWidth * 4, y: baseHeight * 3 },
      { x: baseWidth * 3, y: baseHeight * 2 },
    ],
    {
      ...cfg,
      top: baseHeight * 4,
      name: text.bottom,
      fill: fill.bottom || 'white',
    },
  )

  const polygon3 = new fabric.Polygon( // right
    [
      { x: baseWidth * 3, y: baseHeight },
      { x: baseWidth * 4, y: 0 },
      { x: baseWidth * 4, y: baseHeight * 3 },
      { x: baseWidth * 3, y: baseHeight * 2 },
    ],
    {
      ...cfg,
      name: text.right,
      fill: fill.right || 'white',
    },
  )

  const polygon4 = new fabric.Polygon( // top
    [
      { x: 0, y: 0 },

      { x: baseWidth, y: baseHeight },

      { x: baseWidth * 3, y: baseHeight },
      { x: baseWidth * 4, y: 0 },
    ],
    {
      ...cfg,
      name: text.top,
      fill: fill.top || 'white',
    },
  )

  const g1 = new fabric.Group(
    [
      polygon,
      createFont({
        text: text.left,
        left: baseWidth / 2 - innerFontSize / 3,
        top: baseHeight * 3.5 - innerFontSize / 2,
      }),
      createFont({
        text: symbol.left,
        left: baseWidth / 2 - innerFontSize / 3,
        top: baseHeight * 3.5 - innerFontSize / 2,
      }),
    ],
    {
      ...groupCfg,
      name: `${cellPrefix}left`,
      target: text.left,
      toothIndex: index,
      top: baseHeight * 2,
      // left: 0 - groupWidth / 2,
      // originX: 'center',
      // originY: 'center',
    },
  )
  const g2 = new fabric.Group(
    [
      polygon2,
      createFont({
        text: text.bottom,
        left: baseWidth * 2 - innerFontSize / 4,
        top: baseHeight * 5 - innerFontSize * 1.5,
      }),
      createFont({
        text: symbol.bottom,
        left: baseWidth * 2 - innerFontSize / 4 - 3,
        top: baseHeight * 5 - innerFontSize * 1.5,
      }),
    ],
    {
      ...groupCfg,
      name: `${cellPrefix}bottom`,
      target: text.bottom,
      toothIndex: index,
      top: baseHeight * 4,
    },
  )
  const g3 = new fabric.Group(
    [
      polygon3,
      createFont({
        text: text.right,
        left: baseWidth * 4 - innerFontSize * 1.1,
        top: baseHeight * 3.5 - innerFontSize / 2,
      }),
      createFont({
        text: symbol.right,
        left: baseWidth * 4 - innerFontSize,
        top: baseHeight * 3.5 - innerFontSize / 2,
      }),
    ],
    {
      ...groupCfg,
      name: `${cellPrefix}right`,
      target: text.right,
      toothIndex: index,
      top: baseHeight * 2,
    },
  )
  const g4 = new fabric.Group(
    [
      polygon4,
      createFont({
        text: text.top,
        left: baseWidth * 2 - innerFontSize / 4,
        top: baseHeight * 2 + innerFontSize / 2,
      }),
      createFont({
        text: symbol.top,
        left: baseWidth * 2 - innerFontSize / 4 - 3,
        top: baseHeight * 2 + innerFontSize / 2,
      }),
    ],
    {
      ...groupCfg,
      name: `${cellPrefix}top`,
      target: text.top,
      toothIndex: index,
      top: baseHeight * 2,
    },
  )
  let g5
  let g6
  let g7
  if (!fill.centerfull && !text.centerfull) {
    const polygon5 = new fabric.Polygon( // center left
      [
        { x: baseWidth, y: baseHeight },

        { x: baseWidth, y: baseHeight * 2 },

        { x: baseWidth * 2, y: baseHeight * 2 },
        { x: baseWidth * 2, y: baseHeight },
      ],
      {
        ...cfg,
        top: baseHeight * 3,
        name: text.centerLeft,
        fill: fill.centerLeft || 'white',
      },
    )
    const polygon6 = new fabric.Polygon( // center right
      [
        { x: baseWidth * 2, y: baseHeight },

        { x: baseWidth * 2, y: baseHeight * 2 },

        { x: baseWidth * 3, y: baseHeight * 2 },
        { x: baseWidth * 3, y: baseHeight },
      ],
      {
        ...cfg,
        top: baseHeight * 3,
        name: text.centerRight,
        fill: fill.centerRight || 'white',
      },
    )
    g5 = new fabric.Group(
      [
        polygon5,
        createFont({
          text: text.centerLeft,
          left: baseWidth / 2 + baseWidth - innerFontSize / 4,
          top: baseHeight * 3.5 - innerFontSize / 2,
        }),
        createFont({
          text: symbol.centerLeft,
          left: baseWidth / 2 + baseWidth - innerFontSize / 4,
          top: baseHeight * 3.5 - innerFontSize / 2,
        }),
      ],
      {
        ...groupCfg,
        toothIndex: index,
        target: text.centerLeft,
        name: `${cellPrefix}centerLeft`,
        fill: fill.centerLeft || 'white',
      },
    )
    g6 = new fabric.Group(
      [
        polygon6,
        createFont({
          text: text.centerRight,
          left: baseWidth / 2 + baseWidth * 2 - innerFontSize / 4,
          top: baseHeight * 3.5 - innerFontSize / 2,
        }),
        createFont({
          text: symbol.centerRight,
          left: baseWidth / 2 + baseWidth * 2 - innerFontSize / 4,
          top: baseHeight * 3.5 - innerFontSize / 2,
        }),
      ],
      {
        ...groupCfg,
        toothIndex: index,
        target: text.centerRight,
        name: `${cellPrefix}centerRight`,
        fill: fill.centerRight || 'white',
      },
    )
  } else {
    const polygon7 = new fabric.Polygon( // center
      [
        { x: baseWidth, y: baseHeight },

        { x: baseWidth, y: baseHeight * 2 },

        { x: baseWidth * 3, y: baseHeight * 2 },
        { x: baseWidth * 3, y: baseHeight },
      ],
      {
        ...cfg,
        top: baseHeight * 3,
        name: text.centerfull,
        fill: fill.centerfull || 'white',
      },
    )
    g7 = new fabric.Group(
      [
        polygon7,
        createFont({
          text: text.centerfull,
          left: baseWidth * 2 - innerFontSize / 4,
          top: baseHeight * 3.5 - innerFontSize / 2,
        }),
        createFont({
          text: symbol.centerfull,
          left: baseWidth * 2 - innerFontSize / 4 - 3,
          top: baseHeight * 3.5 - innerFontSize / 2,
        }),
      ],
      {
        ...groupCfg,
        toothIndex: index,
        target: text.centerfull,
        name: `${cellPrefix}centerfull`,
      },
    )
  }
  let fixedItems = [
    // headerText,
    g1,
    g2,
    g3,
    g4,
  ]
  if (g7) {
    fixedItems.push(g7)
  } else {
    fixedItems.push(g5)
    fixedItems.push(g6)
  }
  if (action && action.method === 'bridging') {
    fixedItems = []
    fixedItems.push(
      new fabric.Group(
        [
          createLine([
            -baseWidth * 2,
            0,
            baseWidth * 2,
            0,
          ]),
        ],
        {
          name: 'bridgingIcon',
        },
      ),
    )
  }
  return new fabric.Group(fixedItems.filter((o) => !width && !!o), cCfg)
}
