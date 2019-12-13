import React, { useState, useEffect, useRef } from 'react'
import { withStyles, Divider, Paper } from '@material-ui/core'
import { connect } from 'dva'

import _ from 'lodash'
import DeleteIcon from '@material-ui/icons/Delete'
import AttachMoney from '@material-ui/icons/AttachMoney'
import FilterList from '@material-ui/icons/FilterList'
import moment from 'moment'
import logo from '@/assets/img/logo/logo_blue.png'
import { getUniqueId } from '@/utils/utils'
import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  DatePicker,
  Checkbox,
  Popover,
  Tooltip,
  Select,
  ButtonSelect,
  SketchField,
} from '@/components'

import {
  strokeWidth,
  baseWidth,
  baseHeight,
  zoom,
  fontColor,
  innerFontSize,
  sharedCfg,
  fontCfg,
  groupCfg,
  cellPrefix,
  buttonConfigs,
  overlayShapeTypes,
  lockConfig,
  selectablePrefix,
} from './variables'

import Tooth from './Tooth'

import ButtonGroup from './ButtonGroup'

const { fabric } = require('fabric')

const styles = (theme) => ({
  paper: {
    display: 'flex',
    border: `1px solid ${theme.palette.divider}`,
    flexWrap: 'wrap',
  },
  divider: {
    alignSelf: 'stretch',
    height: 'auto',
    margin: theme.spacing(1, 0.5),
    padding: 0,
    width: 0,
  },
})
const text1 = [
  'd',
  'p',
  'm',
  'b',
  'o',
  'o',
]
const text2 = [
  'd',
  'p',
  'm',
  'b',
  'i',
]
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
const groupWidth = baseWidth * 4 // + strokeWidth
const groupHeight = baseHeight * 3 // + strokeWidth
const fixedHeight = 50
@connect(({ dentalChartComponent, global }) => ({
  dentalChartComponent,
  global,
}))
class DentalChart extends React.Component {
  state = {
    container: null,
  }

  constructor (props) {
    super(props)
    this._canvasContainer = React.createRef()

    this.divContainer = React.createRef()

    this.configs = [
      {
        index: 18,
        text: text1,
        top: true,
        line: 0,
        headerPos: -groupHeight * 1.1,
        posAjustTop: baseHeight * 1.5,
      },
      {
        index: 17,
        text: text1,
        top: true,
        line: 0,
        headerPos: -groupHeight * 1.1,
        posAjustTop: baseHeight * 1.5,
      },
      {
        index: 16,
        text: text1,
        top: true,
        line: 0,
        headerPos: -groupHeight * 1.1,
        posAjustTop: baseHeight * 1.5,
      },
      {
        index: 15,
        text: text1,
        top: true,
        line: 0,
        headerPos: -groupHeight * 1.1,
        posAjustTop: baseHeight * 1.5,
      },
      {
        index: 14,
        text: text1,
        top: true,
        line: 0,
        headerPos: -groupHeight * 1.1,
        posAjustTop: baseHeight * 1.5,
      },
      {
        index: 13,
        text: text2,
        top: true,
        line: 0,
        headerPos: -groupHeight * 1.1,
        posAjustTop: baseHeight * 1.5,
      },
      {
        index: 12,
        text: text2,
        top: true,
        line: 0,
        headerPos: -groupHeight * 1.1,
        posAjustTop: baseHeight * 1.5,
      },
      {
        index: 11,
        text: text2,
        top: true,
        line: 0,
        headerPos: -groupHeight * 1.1,
        posAjustTop: baseHeight * 1.5,
      },
      {
        spacing: true,
        line: 0,
        width: 1,
        posAjustTop: baseHeight * 1.5,
      },
      {
        index: 21,
        text: text2,
        top: true,
        line: 0,
        headerPos: -groupHeight * 1.1,
        posAjustTop: baseHeight * 1.5,
      },
      {
        index: 22,
        text: text2,
        top: true,
        line: 0,
        headerPos: -groupHeight * 1.1,
        posAjustTop: baseHeight * 1.5,
      },
      {
        index: 23,
        text: text2,
        top: true,
        line: 0,
        headerPos: -groupHeight * 1.1,
        posAjustTop: baseHeight * 1.5,
      },
      {
        index: 24,
        text: text1,
        top: true,
        line: 0,
        headerPos: -groupHeight * 1.1,
        posAjustTop: baseHeight * 1.5,
      },
      {
        index: 25,
        text: text1,
        top: true,
        line: 0,
        headerPos: -groupHeight * 1.1,
        posAjustTop: baseHeight * 1.5,
      },
      {
        index: 26,
        text: text1,
        top: true,
        line: 0,
        headerPos: -groupHeight * 1.1,
        posAjustTop: baseHeight * 1.5,
      },
      {
        index: 27,
        text: text1,
        top: true,
        line: 0,
        headerPos: -groupHeight * 1.1,
        posAjustTop: baseHeight * 1.5,
      },
      {
        index: 28,
        text: text1,
        top: true,
        line: 0,
        headerPos: -groupHeight * 1.1,
        posAjustTop: baseHeight * 1.5,
      },
      {
        index: 55,
        pedo: true,
        left: 3,
        text: text1,
        line: 1,
        headerPos: -groupHeight * 0.8,
        posAjustTop: baseHeight * 2.6,
      },
      {
        index: 54,
        pedo: true,
        left: 3,
        text: text1,
        line: 1,
        headerPos: -groupHeight * 0.8,
        posAjustTop: baseHeight * 2.6,
      },
      {
        index: 53,
        pedo: true,
        text: text2,
        left: 3,
        line: 1,
        headerPos: -groupHeight * 0.8,
        posAjustTop: baseHeight * 2.6,
      },
      {
        index: 52,
        pedo: true,
        text: text2,
        left: 3,
        line: 1,
        headerPos: -groupHeight * 0.8,
        posAjustTop: baseHeight * 2.6,
      },
      {
        index: 51,
        pedo: true,
        text: text2,
        left: 3,
        line: 1,
        headerPos: -groupHeight * 0.8,
        posAjustTop: baseHeight * 2.6,
      },
      {
        spacing: true,
        left: 3,
        line: 1,
        width: 1,
        headerPos: -groupHeight * 0.8,
        posAjustTop: baseHeight * 2.6,
      },
      {
        index: 61,
        pedo: true,
        text: text2,
        left: 3,
        line: 1,
        headerPos: -groupHeight * 0.8,
        posAjustTop: baseHeight * 2.6,
      },
      {
        index: 62,
        pedo: true,
        text: text2,
        left: 3,
        line: 1,
        headerPos: -groupHeight * 0.8,
        posAjustTop: baseHeight * 2.6,
      },
      {
        index: 63,
        pedo: true,
        text: text2,
        left: 3,
        line: 1,
        headerPos: -groupHeight * 0.8,
        posAjustTop: baseHeight * 2.6,
      },
      {
        index: 64,
        pedo: true,
        left: 3,
        text: text1,
        line: 1,
        headerPos: -groupHeight * 0.8,
        posAjustTop: baseHeight * 2.6,
      },
      {
        index: 65,
        pedo: true,
        text: text1,
        left: 3,
        line: 1,
        headerPos: -groupHeight * 0.8,
        posAjustTop: baseHeight * 2.6,
      },

      {
        index: 85,
        pedo: true,
        left: 3,
        text: text1,
        line: 2,
        posAjustTop: baseHeight * 3.2,
        headerPos: groupHeight * 0.6,
      },
      {
        index: 84,
        pedo: true,
        left: 3,
        text: text1,
        line: 2,
        posAjustTop: baseHeight * 3.2,
        headerPos: groupHeight * 0.6,
      },
      {
        index: 83,
        pedo: true,
        text: text2,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 3.2,
        headerPos: groupHeight * 0.6,
      },
      {
        index: 82,
        pedo: true,
        text: text2,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 3.2,
        headerPos: groupHeight * 0.6,
      },
      {
        index: 81,
        pedo: true,
        text: text2,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 3.2,
        headerPos: groupHeight * 0.6,
      },
      {
        spacing: true,
        left: 3,
        line: 2,
        width: 40,
        posAjustTop: baseHeight * 3.2,
        headerPos: groupHeight * 0.6,
      },
      {
        index: 71,
        pedo: true,
        text: text2,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 3.2,
        headerPos: groupHeight * 0.6,
      },
      {
        index: 72,
        pedo: true,
        text: text2,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 3.2,
        headerPos: groupHeight * 0.6,
      },
      {
        index: 73,
        pedo: true,
        text: text2,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 3.2,
        headerPos: groupHeight * 0.6,
      },
      {
        index: 74,
        pedo: true,
        left: 3,
        text: text1,
        line: 2,
        posAjustTop: baseHeight * 3.2,
        headerPos: groupHeight * 0.6,
      },
      {
        index: 75,
        pedo: true,
        text: text1,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 3.2,
        headerPos: groupHeight * 0.6,
      },
      {
        index: 48,
        text: text1,
        bottom: true,
        line: 3,
        posAjustTop: baseHeight * 4.4,
        headerPos: groupHeight * 0.9,
      },
      {
        index: 47,
        text: text1,
        bottom: true,
        line: 3,
        posAjustTop: baseHeight * 4.4,
        headerPos: groupHeight * 0.9,
      },
      {
        index: 46,
        text: text1,
        bottom: true,
        line: 3,
        posAjustTop: baseHeight * 4.4,
        headerPos: groupHeight * 0.9,
      },
      {
        index: 45,
        text: text1,
        bottom: true,
        line: 3,
        posAjustTop: baseHeight * 4.4,
        headerPos: groupHeight * 0.9,
      },
      {
        index: 44,
        text: text1,
        bottom: true,
        line: 3,
        posAjustTop: baseHeight * 4.4,
        headerPos: groupHeight * 0.9,
      },
      {
        index: 43,
        text: text2,
        bottom: true,
        line: 3,
        posAjustTop: baseHeight * 4.4,
        headerPos: groupHeight * 0.9,
      },
      {
        index: 42,
        text: text2,
        bottom: true,
        line: 3,
        posAjustTop: baseHeight * 4.4,
        headerPos: groupHeight * 0.9,
      },
      {
        index: 41,
        text: text2,
        bottom: true,
        line: 3,
        posAjustTop: baseHeight * 4.4,
        headerPos: groupHeight * 0.9,
      },
      {
        spacing: true,
        line: 3,
        width: 1,
        posAjustTop: baseHeight * 4.4,
      },
      {
        index: 31,
        text: text2,
        bottom: true,
        line: 3,
        posAjustTop: baseHeight * 4.4,
        headerPos: groupHeight * 0.9,
      },
      {
        index: 32,
        text: text2,
        bottom: true,
        line: 3,
        posAjustTop: baseHeight * 4.4,
        headerPos: groupHeight * 0.9,
      },
      {
        index: 33,
        text: text2,
        bottom: true,
        line: 3,
        posAjustTop: baseHeight * 4.4,
        headerPos: groupHeight * 0.9,
      },
      {
        index: 34,
        text: text1,
        bottom: true,
        line: 3,
        posAjustTop: baseHeight * 4.4,
        headerPos: groupHeight * 0.9,
      },
      {
        index: 35,
        text: text1,
        bottom: true,
        line: 3,
        posAjustTop: baseHeight * 4.4,
        headerPos: groupHeight * 0.9,
      },
      {
        index: 36,
        text: text1,
        bottom: true,
        line: 3,
        posAjustTop: baseHeight * 4.4,
        headerPos: groupHeight * 0.9,
      },
      {
        index: 37,
        text: text1,
        bottom: true,
        line: 3,
        posAjustTop: baseHeight * 4.4,
        headerPos: groupHeight * 0.9,
      },
      {
        index: 38,
        text: text1,
        bottom: true,
        line: 3,
        posAjustTop: baseHeight * 4.4,
        headerPos: groupHeight * 0.9,
      },
      // {
      //   index: 0,
      //   text: [
      //     '',
      //     '',
      //     '',
      //     '',
      //     '',
      //   ],
      // },
    ]
  }

  componentDidMount () {
    console.log(this.divContainer.current)
    console.log(this.divContainer.current.offsetWidth)
    console.log(
      this.divContainer.current.offsetHeight,
      this.props.global.mainDivHeight,
    )
    // window.addEventListener('resize', this.resize.bind(this))
    const width = this.divContainer.current.offsetWidth
    // console.log(width / 2200)
    const canvas = new fabric.Canvas(this._canvasContainer.current, {
      // preserveObjectStacking: true,
      width,
      height: this.props.global.mainDivHeight - fixedHeight,
      // renderOnAddRemove: false,
      // skipTargetFind: true
      name: 'container',
    })
    canvas.setZoom(width / 2200)
    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.noScaleCache = false
    // console.log(logo, index, text)
    canvas.hoverCursor = 'default'

    this.canvas = canvas
    const { data = {}, pedoChart } = this.props.dentalChartComponent
    const { dispatch } = this.props
    // console.log()
    const groups = _.groupBy(this.configs, 'line')
    Object.keys(groups).forEach((k) => {
      groups[k].map((o, order) => {
        this.addGroup({
          ...o,
          order,
          line: k,
          values: data.filter((m) => m.toothIndex === o.index),
          ...this.props,
        })
      })
    })
    this.canvas.renderAll()
    let mouseMoved = false
    let startPointer = null
    this.canvas
      .getObjects('group')
      .filter((n) => Number(n.name) > 0)
      .map((group) => {
        const config = this.configs.find((o) => o.index === Number(group.name))
        if (config.top) {
          let g11 = new fabric.Group(
            [
              new fabric.Polygon(
                [
                  // outside top
                  { x: 0, y: baseHeight * 3 },

                  { x: baseWidth * 1, y: baseHeight * 4 },

                  { x: baseWidth * 3, y: baseHeight * 4 },
                  { x: baseWidth * 4, y: baseHeight * 3 },
                ],
                {
                  ...sharedCfg,
                },
              ),
            ],
            {
              ...groupCfg,
              // opacity: 0.1,
              name: `${cellPrefix}${group.name}outsidetop`,
              // opacity: top ? 1 : 0,
              top: group.translateY - baseHeight * 2.5,
              left: group.translateX - baseWidth * 2,
            },
          )
          g11.rotate(180)
          g11.on('mousedown', (e) => {
            const { action } = this.props.dentalChartComponent
            if (action && action.type === 'cell')
              this.toggleSelect({ group, item: g11 })
          })
          canvas.add(g11)
        }

        if (config.bottom) {
          let g12 = new fabric.Group(
            [
              new fabric.Polygon(
                [
                  // outside top
                  { x: 0, y: baseHeight * 3 },

                  { x: baseWidth * 1, y: baseHeight * 4 },

                  { x: baseWidth * 3, y: baseHeight * 4 },
                  { x: baseWidth * 4, y: baseHeight * 3 },
                ],
                {
                  ...sharedCfg,
                },
              ),
            ],
            {
              ...groupCfg,
              // opacity: 0.1,
              name: `${cellPrefix}${group.name}outsidebottom`,
              // opacity: top ? 1 : 0,
              selectable: true,
              top: group.translateY + baseHeight * 1.5,
              left: group.translateX - baseWidth * 2,
            },
          )
          g12.on('mousedown', (e) => {
            const { action } = this.props.dentalChartComponent
            if (action && action.type === 'cell')
              this.toggleSelect({ group, item: g12 })
          })
          canvas.add(g12)
        }

        group.off('mouseup')
        group.on('mouseup', (e) => {
          if (mouseMoved) return
          const { action } = this.props.dentalChartComponent
          console.log('gesture', e, data, action)
          const config = this.configs.find(
            (o) => o.index === Number(e.target.name),
          )
          if (!config) return
          if (!config.top && e.subTargets[0].name.indexOf('outsidetop') >= 0)
            return
          if (action) {
            // console.log(action, dentalChartComponent)
            if (action.onClick) {
              action.onClick({ group, dispatch })
            } else if (action && overlayShapeTypes.includes(action.value)) {
              this.toggleSelect({ group })
            } else if (
              e.subTargets[0] &&
              action.type === 'cell' &&
              e.subTargets[0].isValidCell()
            ) {
              this.toggleSelect({ item: e.subTargets[0], group })
            } else if (
              e.subTargets[0] &&
              overlayShapeTypes.includes(e.subTargets[0].name) &&
              !e.subTargets[0].disableAutoReplace
            ) {
              this.toggleSelect({ group })
            }
          }
        })
      })

    this.canvas.on('mouse:down', (e) => {
      mouseMoved = false
      startPointer = e.pointer
      console.log('canvas,mouse:down', e)
      this.canvas._objects.map((g) => {
        g.set('selectable', true)
      })
    })
    // this.canvas.on('mouse:move', (e) => {
    //   if (mouseDown) {
    //     console.log('mouse:move', e)
    //     mouseMoved = true
    //   }
    //   // this.canvas._objects.map((g) => {
    //   //   g.set('selectable', true)
    //   // })
    // })
    this.canvas.on('mouse:up', (e) => {
      if (
        Math.abs(e.pointer.x - startPointer.x) > 60 ||
        Math.abs(e.pointer.y - startPointer.y) > 60
      ) {
        mouseMoved = true
      }
      // mouseMoved = false
      // console.log('mouse:move', e)
      // console.log('canvas,mouse:up', e)

      this.canvas._objects.map((g) => {
        g.set('selectable', false)
      })
    })
    this.canvas.on('selection:created', ({ selected, e, target }) => {
      console.log(target.type)
      this.canvas.discardActiveObject()

      if (!this.props.dentalChartComponent.action) return

      setTimeout(() => {
        // console.log('selection:created, mouseMoved', e, target)
        if (
          !mouseMoved ||
          !target ||
          (target.name && target.name.indexOf(selectablePrefix) === 0)
        )
          return
        target.set(lockConfig)

        if (this.props.dentalChartComponent.action.type !== 'cell') {
          this.toggleMultiSelect(
            selected.map((g) => ({
              group: g,
              select: true,
            })),
          )
        } else if (this.props.dentalChartComponent.action.type === 'cell') {
          let cells = []
          selected.map((g) => {
            console.log(g)
            cells = cells.concat(
              g._objects.filter((o) => o.isValidCell()).map((item) => ({
                group: g,
                item,
                select: true,
              })),
            )
          })
          this.toggleMultiSelect(cells)
        }

        // console.log('selection:created', rest)
      }, 1)
    })

    this.renderCanvas(this.props)
  }

  componentWillReceiveProps (nextProps) {
    const { dentalChartComponent, global } = nextProps
    // console.log(
    //   _.isEqual(dentalChartComponent, this.props.dentalChartComponent),
    // )
    if (!_.isEqual(dentalChartComponent, this.props.dentalChartComponent)) {
      this.unbindCanvas(this.props)
      this.renderCanvas(nextProps)
    }
    this.resize(nextProps)
  }

  resize = (props) => {
    const { dentalChartComponent, global } = props || this.props
    const width = this.divContainer.current.offsetWidth

    // console.log(this._canvasContainer.current.offsetWidth, width)
    if (global.mainDivHeight !== this.props.global.mainDivHeight) {
      const height = global.mainDivHeight - fixedHeight
      this.canvas.setDimensions({
        width,
        height,
      })
      this.canvas.setZoom(width / 2200)
    }
  }

  addGroup = ({
    text = [],
    index,
    line = 0,
    order,
    left = 0,
    headerPos,
    posAjustTop = 0,
    top,
    bottom,
    height,
    width,
    values,
    dentalChartComponent,
  }) => {
    const cfg = {
      ...sharedCfg,
      top: baseHeight * 2,
      // strokeUniform: true,
    }

    // console.log(groupCfg, logo)
    const polygon = new fabric.Polygon( // left
      [
        { x: 0, y: 0 },
        { x: 0, y: baseHeight * 3 },
        { x: baseWidth, y: baseHeight * 2 },
        { x: baseWidth, y: baseHeight },
      ],
      {
        // fill: 'purple',
        ...cfg,
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
        // fill: 'red',
        ...cfg,
        top: baseHeight * 4,
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
        // fill: 'green',
        ...cfg,
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
        // fill: 'gray',
        ...cfg,
      },
    )

    const headerText = new fabric.IText(`${index || ''}`, {
      left: -`${index}`.length * 9,
      top: headerPos || 0,
      // top: -groupHeight / 2 + 8,
      // originX: 'center',
      // originY: 'center',
      fontSize: 26,
      ...fontCfg,
    })

    const g1 = new fabric.Group(
      [
        polygon,
        new fabric.IText(text[0] || '', {
          left: baseWidth / 2 - innerFontSize / 4,
          top: baseHeight * 3.5 - innerFontSize / 2,
          fontSize: innerFontSize,
          ...fontCfg,
        }),
      ],
      {
        ...groupCfg,
        name: `${cellPrefix}left`,
        top: baseHeight * 2,
        // left: 0 - groupWidth / 2,
        // originX: 'center',
        // originY: 'center',
      },
    )
    const g2 = new fabric.Group(
      [
        polygon2,
        new fabric.IText(text[1] || '', {
          left: baseWidth * 2 - innerFontSize / 4,
          top: baseHeight * 5 - innerFontSize * 1.5,
          fontSize: innerFontSize,
          ...fontCfg,
        }),
      ],
      {
        ...groupCfg,
        name: `${cellPrefix}bottom`,
        top: baseHeight * 4,
      },
    )
    const g3 = new fabric.Group(
      [
        polygon3,
        new fabric.IText(text[2] || '', {
          left: baseWidth * 4 - innerFontSize * 1.2,
          top: baseHeight * 3.5 - innerFontSize / 2,
          fontSize: innerFontSize,
          ...fontCfg,
        }),
      ],
      {
        ...groupCfg,
        name: `${cellPrefix}right`,
        top: baseHeight * 2,
      },
    )
    const g4 = new fabric.Group(
      [
        polygon4,
        new fabric.IText(text[3] || '', {
          left: baseWidth * 2 - innerFontSize / 4,
          top: baseHeight * 2 + innerFontSize / 2,
          fontSize: innerFontSize,
          ...fontCfg,
        }),
      ],
      {
        ...groupCfg,
        name: `${cellPrefix}top`,
        top: baseHeight * 2,
      },
    )
    let g5
    let g6
    let g7
    if (text) {
      if (text[5]) {
        const polygon5 = new fabric.Polygon( // center left
          [
            { x: baseWidth, y: baseHeight },

            { x: baseWidth, y: baseHeight * 2 },

            { x: baseWidth * 2, y: baseHeight * 2 },
            { x: baseWidth * 2, y: baseHeight },
          ],
          {
            // fill: 'blue',
            ...cfg,
            top: baseHeight * 3,
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
            // fill: 'brown',
            ...cfg,
            top: baseHeight * 3,
          },
        )
        const polygon5Text = new fabric.IText(text[4] || '', {
          left: baseWidth / 2 + baseWidth - innerFontSize / 4,
          top: baseHeight * 3.5 - innerFontSize / 2,
          fontSize: innerFontSize,
          ...fontCfg,
        })
        const polygon6Text = new fabric.IText(text[5] || '', {
          left: baseWidth / 2 + baseWidth * 2 - innerFontSize / 4,
          top: baseHeight * 3.5 - innerFontSize / 2,
          fontSize: innerFontSize,
          ...fontCfg,
        })
        g5 = new fabric.Group(
          [
            polygon5,
            polygon5Text,
          ],
          {
            ...groupCfg,
            name: `${cellPrefix}centerLeft`,
          },
        )
        g6 = new fabric.Group(
          [
            polygon6,
            polygon6Text,
          ],
          {
            ...groupCfg,
            name: `${cellPrefix}centerRight`,
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
            // fill: 'blue',
            ...cfg,
            top: baseHeight * 3,
          },
        )
        const polygon7Text = new fabric.IText(text[4] || '', {
          left: baseWidth * 2 - innerFontSize / 4,
          top: baseHeight * 3.5 - innerFontSize / 2,
          fontSize: innerFontSize,
          ...fontCfg,
        })
        g7 = new fabric.Group(
          [
            polygon7,
            polygon7Text,
          ],
          {
            ...groupCfg,
            name: `${cellPrefix}centerfull`,
          },
        )
      }
    }
    // let g11 = new fabric.Group(
    //   [
    //     new fabric.Polygon(
    //       [
    //         // outside top
    //         { x: 0, y: baseHeight * 3 },

    //         { x: baseWidth * 1, y: baseHeight * 4 },

    //         { x: baseWidth * 3, y: baseHeight * 4 },
    //         { x: baseWidth * 4, y: baseHeight * 3 },
    //       ],
    //       {
    //         ...cfg,
    //       },
    //     ),
    //   ],
    //   {
    //     ...groupCfg,
    //     // opacity: 0.1,
    //     name: `${cellPrefix}outsidetop`,
    //     opacity: top ? 1 : 0,

    //     top: baseHeight,
    //   },
    // )
    // g11.rotate(180)
    let g12 = new fabric.Group(
      [
        new fabric.Polygon(
          [
            // outside bottom
            { x: 0, y: baseHeight * 3 },

            { x: baseWidth * 1, y: baseHeight * 4 },

            { x: baseWidth * 3, y: baseHeight * 4 },
            { x: baseWidth * 4, y: baseHeight * 3 },
          ],
          {
            ...cfg,
          },
        ),
      ],
      {
        ...groupCfg,
        name: `${cellPrefix}outsidebottom`,

        // opacity: 0.1,
        opacity: bottom ? 1 : 0,

        top: baseHeight * 5,
      },
    )

    const fixedItems = [
      // headerText,
      g1,
      g2,
      g3,
      g4,
      // g11,
      // g12,
      // groupt,
    ]
    if (g7) {
      fixedItems.push(g7)
    } else {
      fixedItems.push(g5)
      fixedItems.push(g6)
    }
    console.log(fixedItems)
    const group = new fabric.Group(fixedItems.filter((o) => !width && !!o), {
      ...groupCfg,
      ...lockConfig,

      width: width || groupWidth,
      height: height || groupHeight,
      // padding: 300,
      left: (order + left) * groupWidth + 30,
      top: groupHeight * line + 20 + posAjustTop,
      // originX: 'left',

      // originY: 'center',
      subTargetCheck: true,
      selectable: false,
      selectionBackgroundColor: '#cccccc',

      // transparentCorners: true,
      // cornerColor: 'white',

      // padding: 20,
      // cornerStrokeColor: 'black',
      // cornerStyle: 'circle',
      name: `${index}`,
    })

    group.add(headerText)

    // group.addWithUpdate(g1)
    // group.addWithUpdate(g2)

    // canvas
    //     .getObjects('group')
    //     .filter((n) => Number(n.name) > 0)
    //     .map((group) => {

    //     })

    console.log(group)

    this.canvas.add(group)
  }

  unbindCanvas = (props) => {
    const { dentalChartComponent, dispatch } = props
    const { action = {}, data } = dentalChartComponent
    const { icon, type, hoverColor: hc, onDeselect, clear } = action
    if (onDeselect) {
      onDeselect({ canvas: this.canvas })
    }
  }

  renderCanvas = (props) => {
    console.log('renderCanvas', props.dentalChartComponent.data)
    const { dentalChartComponent, dispatch } = props
    const { action = {}, data, pedoChart } = dentalChartComponent
    const { icon, type, hoverColor: hc, onSelect, clear } = action

    this.canvas
      .getObjects('group')
      .filter((n) => n.name && n.name.indexOf('outside') > 0)
      .map((o) => o.item(0).set('fill', 'white'))

    this.canvas
      .getObjects('group')
      .filter((n) => Number(n.name) > 0)
      .map((group) => {
        const index = Number(group.name)
        if (pedoChart && index >= 55) {
          group.remove()
          return false
        }
        group.filter((n) => !n.isDefaultCell()).map((o) => group.remove(o))
        group
          .filter((n) => n.isValidCell())
          .map((o) => o.item(0).set('fill', 'white'))
        // group.off('mouseup')

        // group.on('mouseup', (e) => {
        //   setTimeout(() => {
        //     console.log('gesture', e)
        //     // console.log(action, dentalChartComponent)
        //     if (action.onClick) {
        //       action.onClick({ group, dispatch })
        //     } else if (action && overlayShapeTypes.includes(action.value)) {
        //       this.toggleSelect({ group })
        //     } else if (
        //       e.subTargets[0] &&
        //       action.type === 'cell' &&
        //       e.subTargets[0].isValidCell()
        //     ) {
        //       this.toggleSelect({ item: e.subTargets[0], group })
        //     }
        //   }, 2)
        // })
        // group.filter((n) => n.isValidCell()).map((item) => {
        //   item.off('mousedown')
        //   item.on('mousedown', (e) => {
        //     console.log('cell gesture', e)
        //     if (
        //       action &&
        //       action.type === 'cell' &&
        //       e.subTargets[0] &&
        //       e.subTargets[0].isValidCell()
        //     )
        //       this.toggleSelect({ item, group })
        //     // if (e.target) {
        //     //   const item = group.object(value)

        //     //   if (
        //     //     item // &&
        //     //     // e.target.canvas // &&
        //     //     // checkIsValidElement(item, name, config.isValidElement)
        //     //   ) {
        //     //     toggleSelect({ item, selected, config, values, dispatch, group })
        //     //   }
        //     // }
        //   })
        // })

        data.filter((m) => m.toothIndex === Number(group.name)).map((o) => {
          const target = buttonConfigs.find((m) => m.value === o.value)
          if (target) {
            if (target.getShape) {
              let newShape = target.getShape({
                canvas: this.canvas,
                group,
                config: o,
              })
              let existed = group.filter((x) => x.name === o.value)[0]
              if (!existed && newShape && newShape.set) {
                // console.log(newShape)
                newShape.set('name', o.value)
                group.add(newShape)
                existed = newShape
              }
              if (existed) existed.bringToFront()
            } else if (target.type === 'cell') {
              let cell = group
                .filter((n) => n.isValidCell())
                .find((t) => t.name === o.target)
              if (!cell) {
                cell = this.canvas._objects.find((t) => t.name === o.target)
              }
              if (cell) cell.item(0).set('fill', target.fill)
            }
            if (target.render) {
              target.render({ group, canvas: this.canvas })
            }
          }
        })

        // console.log(group)
        // const cfg = {
        //   ...props,
        //   values: props.dentalChartComponent.data.filter(
        //     (m) => m.toothIndex === Number(group.name),
        //   ),
        //   canvas: this.canvas,
        //   group,
        // }
        // if (clear) clear(cfg)

        // if (render) render(cfg)
      })
    if (onSelect) {
      onSelect({ canvas: this.canvas })
    }
    this.canvas.renderAll()

    // fabric.Image.fromURL(logo, (img) => {
    //   let oImg = img.set({ left: 0, top: 0 }).scale(0.25)
    //   this.canvas.add(oImg)
    // })
  }

  toggleSelect = ({ item = {}, group, select }) => {
    const { dentalChartComponent } = this.props
    const { action } = dentalChartComponent
    if (action && action.value) {
      debouncedAction(() => {
        this.props.dispatch({
          type: 'dentalChartComponent/toggleSelect',
          payload: {
            toothIndex: Number(group.name),
            value: action.value,
            target: item.name,
            forceSelect: select,
            prevColor:
              item.isValidCell && item.isValidCell() ? item.item(0).fill : '',
          },
        })
      })
    }
  }

  toggleMultiSelect = (ary) => {
    const { dentalChartComponent } = this.props
    const { action } = dentalChartComponent
    if (action && action.value) {
      debouncedAction(() => {
        this.props.dispatch({
          type: 'dentalChartComponent/toggleMultiSelect',
          payload: ary.map(({ group, item = {}, select }) => ({
            toothIndex: Number(group.name),
            value: action.value,
            target: item.name,
            forceSelect: select,
            prevColor:
              item.isValidCell && item.isValidCell() ? item.item(0).fill : '',
          })),
        })
      })
    }
  }

  // resize () {
  //   if (this.divContainer.current) {
  //     console.log({
  //       width: this.divContainer.current.offsetWidth,
  //       height: this.props.global.mainDivHeight - 50,
  //     })
  //     this.canvas.setDimensions({
  //       width: this.divContainer.current.offsetWidth,
  //       height: this.props.global.mainDivHeight - 50,
  //     })
  //   }
  // }

  render () {
    const {
      className,
      canvasDivStyle,
      theme,
      index,
      arrayHelpers,
      diagnosises,
      classes,
      form,
      field,
      style,
      onChange,
      value,
      mode,
      onDataSouceChange,
      dentalChartComponent,
      dispatch,
      ...props
    } = this.props
    const { data = {} } = dentalChartComponent
    return (
      <div className={className}>
        <GridContainer>
          <GridItem md={9}>
            <div ref={this.divContainer}>
              <canvas id={this.id} ref={this._canvasContainer} />
            </div>
            {/* {this.state.container &&
              this.configs.map((o) => {
                console.log(data.filter((m) => m.toothIndex === o.index))
                return (
                  <Tooth
                    {...o}
                    container={this.state.container}
                    values={data.filter((m) => m.toothIndex === o.index)}
                    {...this.props}
                  />
                )
              })} */}
          </GridItem>
          <GridItem md={3}>
            <Checkbox
              label='Pedo Chart'
              onChange={(v) => {
                dispatch({
                  type: 'dentalChartComponent/updateState',
                  payload: {
                    pedoChart: v.target.value,
                  },
                })
              }}
            />
          </GridItem>
        </GridContainer>

        <ButtonGroup {...this.props} />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(DentalChart)
