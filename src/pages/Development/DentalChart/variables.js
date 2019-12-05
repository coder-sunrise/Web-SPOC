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
  name: 'cell',
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

const renderOutsideTopCell = (canvas, config, { dispatch, values = [] }) => {
  const selected = values.find((o) => o.value === config.value)
  console.log(config, selected, values)

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
      opacity: selected ? 1 : 0.1,
      ...config,
      name: 'selected_topcell',
    },
  )
  shape.rotate(180)
  // const group = new fabric.Group(
  //   [
  //     shape,
  //   ],
  //   {
  //     ...groupCfg,
  //     name: 'selectedGroup',
  //   },
  // )

  setTimeout(() => {
    canvas.off('mouse:over')
    canvas.on('mouse:over', (e) => {
      if (e.target) {
        const item = e.target

        if (item && item.name === `${modifierNamePrefix}topcell` && !selected) {
          item.set('opacity', 1)
          item.set('fill', config.fill)

          canvas.renderAll()
        }
      }
    })
    canvas.off('mouse:out')
    canvas.on('mouse:out', (e) => {
      if (e.target) {
        const item = e.target
        if (item && item.name === `${modifierNamePrefix}topcell` && !selected) {
          item.set('opacity', 0.1)
          item.set('fill', config.fill)

          canvas.renderAll()
        }
      }
    })
    canvas.off('mouse:up')
    canvas.on('mouse:up', (e) => {
      // console.log('gesture', e)
      if (e.target) {
        const item = e.target

        if (
          item &&
          e.target.canvas &&
          item.name === `${modifierNamePrefix}topcell`
        ) {
          debouncedAction(() => {
            dispatch({
              type: 'dentalChartComponent/toggleSelect',
              payload: {
                ...config,
                ...selected,
                toothIndex: e.target.canvas.name,
              },
            })
          })

          if (selected) {
            item.set('opacity', 0.1)
          } else {
            item.set('opacity', 1)
          }

          // item.set('fill', config.fill)

          canvas.renderAll()
        }
      }
    })
  }, 1)
  canvas.add(shape)
  canvas.sendToBack(shape)
}
const sharedButtonConfig = {
  clear: (canvas, { values = [] }) => {
    // console.log(currentSelectedGroup)
    canvas
      .getObjects()
      .filter((o) => {
        if (!o.name || o.name.indexOf(modifierNamePrefix) < 0) return false
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
        if (
          !o.getObjects &&
          values.find(
            (m) => o.name && o.name.replace(modifierNamePrefix, '') === m.value,
          )
        )
          return false
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
    hoverColor: '#9c9c98',
  },
  {
    value: 'onlayveneer',
    icon: onlayveneer,
    text: 'Onlay/Veneer',
    ...sharedButtonConfig,
    render: (canvas) => {
      console.log(canvas)
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
          name: `${modifierNamePrefix}onlayveneer`,
        },
      )

      canvas.add(group)
      canvas.sendToBack(group)
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
        },
        props,
      )
    },
  },
]
