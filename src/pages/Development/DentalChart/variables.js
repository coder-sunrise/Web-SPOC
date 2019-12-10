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

const { fabric } = require('fabric')

const modifierNamePrefix = 'selected_'
export const cellPrefix = 'cell_'

fabric.Object.prototype.set({
  cornerSize: 0,
  hasBorders: false,
  lockMovementX: true,
  lockMovementY: true,
  lockRotation: true,
})
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
export const innerFontSize = 16
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
}

export const fontCfg = {
  selectable: false,
  fontFamily: 'Roboto',
  fill: fontColor,
  editable: false,
}
export const overlayShapeTypes = [
  'onlayveneer',
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
export const buttonConfigs = [
  {
    value: 'clear',
    icon: clear,
    text: 'Clear',
    type: 'cell',
    onClick: ({ dispatch, group }) => {
      dispatch({
        type: 'dentalChartComponent/clean',
        payload: {
          toothIndex: Number(group.name),
        },
      })
    },
  },
  {
    value: 'missing',
    icon: missing,
    text: 'Missing',
  },
  {
    value: 'caries',
    icon: caries,
    text: 'Caries',
    type: 'cell',
    fill: '#824f4f',
  },
  {
    value: 'recurrentdecay',
    icon: recurrentdecay,
    text: 'Recurrent Decay',
    type: 'cell',
    fill: '#f79e02',
  },
  {
    value: 'nccl',
    icon: nccl,
    text: 'NCCL',
    type: 'cell',
    fill: '#ffe921',
  },
  {
    value: 'fractured',
    icon: fractured,
    text: 'Fractured',
  },
  {
    value: 'filling',
    icon: filling,
    text: 'Filling',
    type: 'cell',
    fill: '#737372',
  },
  {
    value: 'temporarydressing',
    icon: temporarydressing,
    text: 'Temporary Dressing',
    type: 'cell',
    fill: '#9c9c98',
    // render: (props) => {
    //   renderOutsideTopCell(
    //     {
    //       fill: '#9c9c98',
    //       value: 'temporarydressing',
    //       unselectedOpactiy: 1,
    //       isValidElement: (item, name) => {
    //         console.log(item.name.indexOf(cellPrefix), name)
    //         return item.name.indexOf(cellPrefix) === 0
    //       },
    //     },
    //     props,
    //   )
    // },
  },
  {
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
        fill: '#cccccc',
        // top: baseHeight * 2 + 5,
        ...sharedCfg,
      })
      const onlayveneerInner2 = new fabric.Triangle({
        top: baseHeight + 5,
        left: baseWidth / 2 + 15,
        width: baseWidth * 2,
        height: baseHeight * 2 - 10,
        fill: '#ffffff',
        // top: baseHeight * 3 + 5,
        ...sharedCfg,
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
    render: (props) => {
      renderOutsideTopCell(
        {
          icon: onlayveneer,
          value: 'onlayveneer',
          unselectedOpactiy: 0,
        },
        props,
      )
    },
  },

  {
    value: 'topcell',
    // icon: onlayveneer,
    text: 'Top',
    color: 'brown',
    ...sharedButtonConfig,
    render: (props) => {
      renderOutsideTopCell(
        {
          fill: 'brown',
          value: 'topcell',
          unselectedOpactiy: 0.1,
          addonShapeHandler: ({ selected, config }) => {
            const shape = new fabric.Polygon( // outside top
              [
                { x: 0, y: 0 },

                { x: baseWidth * 1, y: baseHeight },

                { x: baseWidth * 3, y: baseHeight },
                { x: baseWidth * 4, y: 0 },
              ],
              {
                ...config,
              },
            )
            shape.rotate(180)
            const group = new fabric.Group(
              [
                shape,
              ],
              {
                ...addonGroupCfg,
                top: -baseHeight * 2.5 - strokeWidth / 2,
              },
            )
            return group
          },
        },
        props,
      )
    },
  },

  {
    value: 'bottomcell',
    // icon: onlayveneer,
    text: 'Bottom',
    color: 'brown',
    ...sharedButtonConfig,
    render: (props) => {
      renderOutsideTopCell(
        {
          fill: 'brown',
          value: 'bottomcell',
          unselectedOpactiy: 0.1,

          addonShapeHandler: ({ selected, config }) => {
            const shape = new fabric.Polygon( // outside top
              [
                { x: 0, y: baseHeight },

                { x: baseWidth * 1, y: 0 },

                { x: baseWidth * 3, y: 0 },
                { x: baseWidth * 4, y: baseHeight },
              ],
              {
                ...config,
              },
            )
            shape.rotate(180)
            const group = new fabric.Group(
              [
                shape,
              ],
              {
                ...addonGroupCfg,
                top: baseHeight * 1.5 + strokeWidth / 2,
              },
            )
            return group
          },
        },
        props,
      )
    },
  },
]
