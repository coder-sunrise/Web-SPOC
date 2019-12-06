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

export const strokeWidth = 2
export const baseWidth = 30
export const baseHeight = 40
export const zoom = 1
export const fontColor = '#000000'
export const innerFontSize = 16
export const groupCfg = {
  selectable: false,
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
const modifierNamePrefix = 'selected_'
export const cellPrefix = 'cell_'

let currentSelectedStyle = null
let currentSelectedGroup = null
const renderBackgroud = () => {
  return new fabric.Rect({
    ...sharedCfg,
    width: baseWidth * 4,
    height: baseHeight * 3,
    name: 'replaceObject',
    top: baseHeight * 2,
    fill: '#ffffff',
    opacity: 1,
  })
}
let currentPointer
const renderOutsideTopCell = (
  canvas,
  { addonShapeHandler, customizeHover = false, hoverOpacity = 0.1, ...config },
  { dispatch, values = [] },
) => {
  console.log(config, values)

  const selected = values.filter((o) => o.value === config.value)
  const { value } = config
  const name = `${modifierNamePrefix}${value}`
  const shape =
    typeof addonShapeHandler === 'function'
      ? addonShapeHandler({ selected, config })
      : undefined

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
  canvas.off('mouse:over')
  canvas.off('mouse:out')
  canvas.off('mouse:up')

  if (
    [
      'topcell',
      'bottomcell',
    ].includes(config.value)
  ) {
    canvas.on('mouse:over', (e) => {
      if (e.target) {
        const item = e.target

        if (item && item.name === name && selected.length === 0) {
          item.set('opacity', 1)
          item.set('fill', config.fill)

          canvas.renderAll()
        }
      }
    })
    canvas.on('mouse:out', (e) => {
      if (e.target) {
        const item = e.target
        if (item && item.name === name && selected.length === 0) {
          item.set('opacity', 0.1)
          item.set('fill', config.fill)

          canvas.renderAll()
        }
      }
    })
  } else if (
    [
      'temporarydressing',
    ].includes(config.value)
  ) {
    canvas
      .getObjects()
      .filter((o) => o.name && o.name.indexOf(cellPrefix) === 0)
      .map((g) => {
        const item = g.item(0)
        if (item) {
          if (selected.find((m) => g.name === m.target)) {
            item.set('fill', config.fill)
          } else {
            item.set('fill', `white`)
          }
        }
      })

    let colorBefore = null
    canvas.on('mouse:over', (e) => {
      // console.log(e, e.target)
      if (e.target && e.target.item) {
        const item = e.target.item(0)

        if (item && !selected.find((o) => o.target === e.target.name)) {
          colorBefore = item.get('fill')
          item.set('fill', config.fill)
          // canvas.getObjects('group').map((o) => {
          //   if (o.name && o.name.indexOf(cellPrefix) === 0) o.set('opacity', 1)
          // })
          canvas.renderAll()
        }
      }
    })

    canvas.on('mouse:out', (e) => {
      if (e.target && e.target.item) {
        const item = e.target.item(0)
        if (item && !selected.find((o) => o.target === e.target.name)) {
          item.set('fill', colorBefore || 'white')
          // canvas.getObjects('group').map((o) => {
          //   if (o.name && o.name.indexOf(cellPrefix) === 0) o.set('opacity', 0.1)
          // })

          canvas.renderAll()
        }
      }
    })
  } else if (
    [
      'onlayveneer',
    ].includes(value)
  ) {
    canvas.on('mouse:over', (e) => {
      if (e.target && e.target.item && selected.length === 0) {
        const item = e.target.item(0)
        if (item) {
          canvas.getObjects('group').map((o) => {
            // if (o.name && o.name.indexOf(cellPrefix) === 0) o.set('opacity', this.hoverOpacity)
            if (o.name && o.name.indexOf(cellPrefix) === 0) canvas.sendToBack(o)
          })
          canvas.renderAll()
        }
      }
    })
    canvas.on('mouse:out', (e) => {
      if (e.target && e.target.item && selected.length === 0) {
        const item = e.target.item(0)
        if (item) {
          canvas.getObjects('group').map((o) => {
            // if (o.name && o.name.indexOf(cellPrefix) === 0) o.set('opacity', 1)
            if (o.name && o.name.indexOf(cellPrefix) === 0)
              canvas.bringToFront(o)
          })

          canvas.renderAll()
        }
      }
    })
  }
  canvas.on('mouse:up', (e) => {
    console.log('gesture', e)
    if (e.target) {
      const item = e.target

      if (
        item &&
        e.target.canvas &&
        checkIsValidElement(item, name, config.isValidElement)
      ) {
        debouncedAction(() => {
          console.log(config, selected, e.target.canvas.name, item.name)

          const currentSelctedValue = selected.find(
            (o) =>
              o.value === config.value && (o.target === item.name || !o.target),
          )
          dispatch({
            type: 'dentalChartComponent/toggleSelect',
            payload: {
              ...config,
              ...currentSelctedValue,
              toothIndex: e.target.canvas.name,
              target: item.name,
            },
          })

          if (currentSelctedValue) {
            item.set('opacity', hoverOpacity || 0.1)
            item.set('fill', 'white')
            if (shape) canvas.sendToBack(item)
          } else {
            item.set('opacity', 1)
            if (shape) canvas.bringToFront(item)
          }

          // item.set('fill', config.fill)

          canvas.renderAll()
        })
      }
    }
  })
  if (shape) {
    shape.set('name', name)
    canvas.add(shape)
    if (selected.length === 0) canvas.sendToBack(shape)
  }
}
const sharedButtonConfig = {
  clear: (canvas, { values = [] }) => {
    // console.log(currentSelectedGroup)
    // console.log(values)
    canvas
      .getObjects()
      .filter((o) => {
        if (!o.name || o.name.indexOf(modifierNamePrefix) < 0) return false
        if (
          values.find(
            (m) => o.name && o.name.replace(modifierNamePrefix, '') === m.value,
          )
        )
          return false
        if (
          o.getObjects &&
          values.find(
            (m) =>
              o
                .getObjects()
                .filter(
                  (n) =>
                    n.name &&
                    n.name.replace(modifierNamePrefix, '') === m.value,
                ).length > 0,
          )
        ) {
          return false
        }

        // if(canvas.name, value.toothIndex)
        console.log(o, canvas.name, values)
        return true
      })
      .map((o) => {
        console.log(o)
        canvas.remove(o)
      })
  },
}
export const buttonConfigs = [
  {
    value: 'clear',
    icon: clear,
    text: 'Clear',
    type: 'cell',
    onCellClick: () => {},
    hoverColor: '#ffffff',
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
    hoverColor: '#824f4f',
    onCellClick: () => {},
  },
  {
    value: 'recurrentdecay',
    icon: recurrentdecay,
    text: 'Recurrent Decay',
    type: 'cell',
    hoverColor: '#f79e02',
  },
  {
    value: 'nccl',
    icon: nccl,
    text: 'NCCL',
    type: 'cell',
    hoverColor: '#ffe921',
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
    hoverColor: '#737372',
  },
  {
    value: 'temporarydressing',
    icon: temporarydressing,
    text: 'Temporary Dressing',
    type: 'cell',
    render: (canvas, props) => {
      renderOutsideTopCell(
        canvas,
        {
          fill: '#9c9c98',
          value: 'temporarydressing',
          hoverOpacity: 1,
          isValidElement: (item, name) => {
            console.log(item.name.indexOf(cellPrefix), name)
            return item.name.indexOf(cellPrefix) === 0
          },
        },
        props,
      )
    },
  },
  {
    value: 'onlayveneer',
    icon: onlayveneer,
    text: 'Onlay/Veneer',
    ...sharedButtonConfig,

    render: (canvas, props) => {
      renderOutsideTopCell(
        canvas,
        {
          icon: onlayveneer,
          value: 'onlayveneer',
          addonShapeHandler: ({ selected, config }) => {
            const onlayveneerInner1 = new fabric.Triangle({
              left: baseWidth * 0.5 / 2 + 5,
              width: baseWidth * 3.5 - 10,
              height: baseHeight * 3 - 10,
              fill: '#cccccc',
              top: baseHeight * 2 + 5,
              ...sharedCfg,
            })
            const onlayveneerInner2 = new fabric.Triangle({
              // top: 300,
              left: baseWidth / 2 + 15,
              width: baseWidth * 2,
              height: baseHeight * 2 - 10,
              fill: '#ffffff',
              top: baseHeight * 3 + 5,
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
                ...groupCfg,
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
    value: 'topcell',
    // icon: onlayveneer,
    text: 'Top',
    color: 'brown',
    ...sharedButtonConfig,
    render: (canvas, props) => {
      renderOutsideTopCell(
        canvas,
        {
          fill: 'brown',
          value: 'topcell',
          addonShapeHandler: ({ selected, config }) => {
            const shape = new fabric.Polygon( // outside top
              [
                { x: 0, y: baseHeight * 4 },

                { x: baseWidth * 1, y: baseHeight * 5 },

                { x: baseWidth * 3, y: baseHeight * 5 },
                { x: baseWidth * 4, y: baseHeight * 4 },
              ],
              {
                ...sharedCfg,
                top: baseHeight,
                opacity: selected.length ? 1 : 0.1,
                ...config,
              },
            )
            shape.rotate(180)
            return shape
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
    render: (canvas, props) => {
      renderOutsideTopCell(
        canvas,
        {
          fill: 'brown',
          value: 'bottomcell',
          addonShapeHandler: ({ selected, config }) => {
            const shape = new fabric.Polygon( // outside top
              [
                { x: 0, y: baseHeight },

                { x: baseWidth * 1, y: 0 },

                { x: baseWidth * 3, y: 0 },
                { x: baseWidth * 4, y: baseHeight },
              ],
              {
                ...sharedCfg,
                opacity: selected.length ? 1 : 0.1,
                fill: 'brown',
                top: baseHeight * 5,
                ...config,
              },
            )
            shape.rotate(180)
            return shape
          },
        },
        props,
      )
    },
  },
]
