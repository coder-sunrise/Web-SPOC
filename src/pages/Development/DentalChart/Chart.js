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
  groupBtns: {
    display: 'block',
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

class Chart extends React.Component {
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
        posAjustTop: baseHeight * 4,
      },
      {
        index: 17,
        text: text1,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 16,
        text: text1,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 15,
        text: text1,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 14,
        text: text1,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 13,
        text: text2,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 12,
        text: text2,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 11,
        text: text2,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        spacing: true,
        line: 0,
        width: 1,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 21,
        text: text2,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 22,
        text: text2,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 23,
        text: text2,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 24,
        text: text1,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 25,
        text: text1,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 26,
        text: text1,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 27,
        text: text1,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 28,
        text: text1,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 55,
        pedo: true,
        left: 3,
        text: text1,
        line: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        index: 54,
        pedo: true,
        left: 3,
        text: text1,
        line: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        index: 53,
        pedo: true,
        text: text2,
        left: 3,
        line: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        index: 52,
        pedo: true,
        text: text2,
        left: 3,
        line: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        index: 51,
        pedo: true,
        text: text2,
        left: 3,
        line: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        spacing: true,
        left: 3,
        line: 1,
        width: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        index: 61,
        pedo: true,
        text: text2,
        left: 3,
        line: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        index: 62,
        pedo: true,
        text: text2,
        left: 3,
        line: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        index: 63,
        pedo: true,
        text: text2,
        left: 3,
        line: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        index: 64,
        pedo: true,
        left: 3,
        text: text1,
        line: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        index: 65,
        pedo: true,
        text: text1,
        left: 3,
        line: 1,
        posAjustTop: baseHeight * 5,
      },

      {
        index: 85,
        pedo: true,
        left: 3,
        text: text1,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 84,
        pedo: true,
        left: 3,
        text: text1,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 83,
        pedo: true,
        text: text2,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 82,
        pedo: true,
        text: text2,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 81,
        pedo: true,
        text: text2,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        spacing: true,
        left: 3,
        line: 2,
        width: 40,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 71,
        pedo: true,
        text: text2,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 72,
        pedo: true,
        text: text2,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 73,
        pedo: true,
        text: text2,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 74,
        pedo: true,
        left: 3,
        text: text1,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 75,
        pedo: true,
        text: text1,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 48,
        text: text1,
        bottom: true,
        line: 3,
      },
      {
        index: 47,
        text: text1,
        bottom: true,
        line: 3,
      },
      {
        index: 46,
        text: text1,
        bottom: true,
        line: 3,
      },
      {
        index: 45,
        text: text1,
        bottom: true,
        line: 3,
      },
      {
        index: 44,
        text: text1,
        bottom: true,
        line: 3,
      },
      {
        index: 43,
        text: text2,
        bottom: true,
        line: 3,
      },
      {
        index: 42,
        text: text2,
        bottom: true,
        line: 3,
      },
      {
        index: 41,
        text: text2,
        bottom: true,
        line: 3,
      },
      {
        spacing: true,
        line: 3,
        width: 1,
      },
      {
        index: 31,
        text: text2,
        bottom: true,
        line: 3,
      },
      {
        index: 32,
        text: text2,
        bottom: true,
        line: 3,
      },
      {
        index: 33,
        text: text2,
        bottom: true,
        line: 3,
      },
      {
        index: 34,
        text: text1,
        bottom: true,
        line: 3,
      },
      {
        index: 35,
        text: text1,
        bottom: true,
        line: 3,
      },
      {
        index: 36,
        text: text1,
        bottom: true,
        line: 3,
      },
      {
        index: 37,
        text: text1,
        bottom: true,
        line: 3,
      },
      {
        index: 38,
        text: text1,
        bottom: true,
        line: 3,
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
    // console.log(this.divContainer.current)
    // console.log(this.divContainer.current.offsetWidth)
    // console.log(
    //   this.divContainer.current.offsetHeight,
    //   this.props.global.mainDivHeight,
    // )
    // window.addEventListener('resize', this.resize.bind(this))
    const width = this.divContainer.current.offsetWidth
    // console.log(width / 2200)
    const canvas = new fabric.Canvas(this._canvasContainer.current, {
      // preserveObjectStacking: true,
      ...this.getCanvasSize(),
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
        const index = Number(group.name)
        const config = this.configs.find((o) => o.index === index)
        // const headerText = new fabric.IText(`${group.name || ''}`, {
        //   // left: -`${index}`.length * 9,
        //   // top: headerPos || 0,
        //   // // top: -groupHeight / 2 + 8,
        //   // // originX: 'center',
        //   // // originY: 'center',
        //   fontSize: 26,
        //   ...fontCfg,
        // })
        const headerConfig = {
          left: group.translateX - `${index}`.length * 7,

          name: `header_${index}`,
          selectable: false,
          fontSize: 26,
          ...fontCfg,
        }
        if (config.top) {
          const p = new fabric.Group(
            [
              new fabric.Polygon(
                [
                  // outside top
                  { x: 0, y: baseHeight * 3 },

                  { x: baseWidth * 2, y: baseHeight * 6 },

                  // { x: baseWidth * 3, y: baseHeight * 4 },
                  { x: baseWidth * 4, y: baseHeight * 3 },
                ],
                {
                  ...sharedCfg,
                  name: 'root',
                },
              ),
            ],
            {
              ...sharedCfg,
              name: `${cellPrefix}outsidetop`,
              toothIndex: index,
            },
          )

          p.rotate(180)

          let g11 = new fabric.Group(
            [
              p,
            ],
            {
              ...groupCfg,
              // opacity: 0.1,
              name: `${cellPrefix}${index}outsidetop`,
              target: 'root',
              index,
              // opacity: top ? 1 : 0,
              top: group.translateY - baseHeight * 4.5 - strokeWidth,
              left: group.translateX - baseWidth * 2 - strokeWidth,
              subTargetCheck: true,
            },
          )
          g11.on('mousedown', (e) => {
            // console.log({ group: e.target, item: e.subTargets[0] })
            const { action } = this.props.dentalChartComponent
            if (action)
              this.toggleSelect({
                group: e.target,
                item: e.target._objects.find(
                  (o) => o.name === `${cellPrefix}outsidetop`,
                ),
              })
          })
          g11.add(
            new fabric.IText(`${index || ''}`, {
              top: -baseHeight * 2.3,
              ...headerConfig,
              left: 0 - `${index}`.length * 7,
            }),
          )
          canvas.add(g11)
        } else if (config.bottom) {
          const p = new fabric.Group(
            [
              new fabric.Polygon(
                [
                  // outside top
                  { x: 0, y: baseHeight * 3 },

                  { x: baseWidth * 2, y: baseHeight * 6 },

                  // { x: baseWidth * 3, y: baseHeight * 4 },
                  { x: baseWidth * 4, y: baseHeight * 3 },
                ],
                {
                  ...sharedCfg,
                  name: 'root',
                },
              ),
            ],
            {
              ...sharedCfg,
              name: `${cellPrefix}outsidebottom`,
              toothIndex: index,
            },
          )
          let g12 = new fabric.Group(
            [
              p,
            ],
            {
              ...groupCfg,
              // opacity: 0.1,
              name: `${cellPrefix}${index}outsidebottom`,
              index,
              target: 'root',
              top: group.translateY - baseHeight * 4.5 - strokeWidth,
              // opacity: top ? 1 : 0,
              selectable: true,
              left: group.translateX - baseWidth * 2 - strokeWidth,
              subTargetCheck: true,
            },
          )
          g12.on('mousedown', (e) => {
            // console.log('g12 mousedown')
            const { action } = this.props.dentalChartComponent
            if (action)
              this.toggleSelect({
                group: e.target,
                item: e.target._objects.find(
                  (o) => o.name === `${cellPrefix}outsidebottom`,
                ),
              })
          })
          g12.add(
            new fabric.IText(`${index || ''}`, {
              top: baseHeight * 1.7,
              ...headerConfig,
              left: 0 - `${index}`.length * 7,
            }),
          )
          canvas.add(g12)
        } else if (index > 50 && index < 70) {
          canvas.add(
            new fabric.IText(`${index || ''}`, {
              top: group.translateY - baseHeight * 2.3,
              ...headerConfig,
            }),
          )
        } else if (index > 70 && index < 90) {
          canvas.add(
            new fabric.IText(`${index || ''}`, {
              top: group.translateY + baseHeight * 1.7,
              ...headerConfig,
            }),
          )
        }

        group.off('mouseup')
        group.on('mouseup', (e) => {
          if (mouseMoved) return
          const { action } = this.props.dentalChartComponent
          // console.log('gesture', e, data, action)
          const cfg = this.configs.find(
            (o) => o.index === Number(e.target.name),
          )
          if (!cfg) return
          if (
            !cfg.top &&
            (!e.subTargets[0] ||
              e.subTargets[0].name.indexOf('outsidetop') >= 0)
          )
            return
          if (action) {
            // console.log(action, dentalChartComponent)
            if (action.onClick) {
              action.onClick({ group, dispatch })
            } else if (action.type === 'cell') {
              // console.log(e.subTargets[0], group)
              const existShapes = group.filter((o) => o.isShape)
              if (existShapes.length > 0) {
                existShapes.map((o) => group.remove(o))
                this.canvas.renderAll()
              } else {
                this.toggleSelect({ item: e.subTargets[0], group })
              }
            } else if (action.method === 'tooth') {
              this.toggleSelect({
                group,
                item: {
                  name: 'tooth',
                },
              })
            }
          }
        })
      })

    this.canvas.on('mouse:down', (e) => {
      mouseMoved = false
      startPointer = e.pointer
      // console.log('canvas,mouse:down', e)
      this.canvas._objects.map((g) => {
        if (g.opacity) g.set('selectable', true)
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
        if (g.opacity) g.set('selectable', false)
      })
    })
    this.canvas.on('selection:created', ({ selected, e, target }) => {
      // console.log(selected.filter(o=>o._objects.length))

      // return
      // console.log(target.type)
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
          // console.log(selected)
          this.toggleMultiSelect(
            selected.filter((o) => o._objects.length).map((g) => ({
              group: g,
              item:
                g._objects.filter((o) => o.name.indexOf(`${cellPrefix}`) === 0)
                  .length === 1
                  ? g._objects[0]
                  : {
                      name: 'tooth',
                    },

              select: true,
            })),
          )
        } else if (this.props.dentalChartComponent.action.type === 'cell') {
          let cells = []
          selected.filter((o) => o._objects).map((g) => {
            // console.log(g)
            cells = cells.concat(
              g._objects.filter((m) => m.toothIndex).map((item) => ({
                group: g,
                item,
                select: true,
              })),
            )
          })
          // console.log(cells)
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
    //   'componentWillReceiveProps',
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

    // if (global.mainDivHeight !== this.props.global.mainDivHeight) {
    //   const height = global.mainDivHeight - fixedHeight

    // }
    // console.log(this.getCanvasSize())
    // console.log(width, this.state.width)

    if (
      width !== this.state.width ||
      dentalChartComponent.pedoChart !== this.state.pedoChart
    ) {
      this.setState({
        width,
        pedoChart: dentalChartComponent.pedoChart,
      })
      this.canvas.setDimensions(this.getCanvasSize(props))
      this.canvas.setZoom(width / 2200)
    }
  }

  getCanvasSize = (props) => {
    const { pedoChart } = (props || this.props).dentalChartComponent

    const width = this.divContainer.current.offsetWidth
    // console.log(pedoChart, width)
    return {
      width,
      height: pedoChart ? Math.floor(width / 2.3) : Math.floor(width / 3.3),
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
        ...cfg,
        name: text[0],
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
        name: text[1],
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
        name: text[2],
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
        name: text[3],
      },
    )

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
        target: text[0],
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
        target: text[1],
        toothIndex: index,
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
        target: text[2],
        toothIndex: index,
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
        target: text[3],
        toothIndex: index,
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
            ...cfg,
            top: baseHeight * 3,
            name: text[4],
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
            name: text[5],
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
            toothIndex: index,
            target: text[4],
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
            toothIndex: index,
            target: text[5],
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
            ...cfg,
            top: baseHeight * 3,
            name: text[4],
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
            toothIndex: index,
            target: text[4],
            name: `${cellPrefix}centerfull`,
          },
        )
      }
    }

    const fixedItems = [
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
    // console.log(fixedItems)
    const group = new fabric.Group(fixedItems.filter((o) => !width && !!o), {
      ...groupCfg,
      ...lockConfig,

      width: width || groupWidth,
      height: height || groupHeight,
      // padding: 300,
      left: (order + left) * groupWidth + 30,
      top: groupHeight * line + 20 + posAjustTop,
      // originX: 'left',
      index,
      // originY: 'center',
      subTargetCheck: true,
      selectable: false,
      selectionBackgroundColor: '#cccccc',
      // opacity: 0,
      // transparentCorners: true,
      // cornerColor: 'white',

      // padding: 20,
      // cornerStrokeColor: 'black',
      // cornerStyle: 'circle',
      name: `${index}`,
    })

    // group.add(headerText)

    // group.addWithUpdate(g1)
    // group.addWithUpdate(g2)

    // canvas
    //     .getObjects('group')
    //     .filter((n) => Number(n.name) > 0)
    //     .map((group) => {

    //     })

    // console.log(group)

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
    // console.log('renderCanvas', props.dentalChartComponent.data)
    const { dentalChartComponent, dispatch } = props
    const { action = {}, data, pedoChart, surfaceLabel } = dentalChartComponent
    const { icon, type, hoverColor: hc, onSelect, clear } = action

    this.canvas.getObjects('group').filter((n) => n.index > 0).map((group) => {
      // console.log(group)
      const { index } = group
      // console.log(index, 'index')
      if (index > 50 && index < 90) {
        const header = this.canvas._objects.find(
          (m) => m.name === `header_${index}`,
        )
        if (header) {
          header.set('opacity', pedoChart ? 1 : 0)
          // header.set('top', group.translateY + 50)
        }
      }
      if (!pedoChart && index >= 50) {
        group.set('opacity', 0)
        // group.set('evented', false)
        // group.sendToBack()

        // this.canvas.remove(group)

        return false
      }
      // console.log(group._objects.find((m) => m.name === `header_${index}`))
      group.set('opacity', 1)
      // group.set('evented', true)
      // group.bringToFront()

      if (index > 30 && index < 50) {
        if (!pedoChart) {
          group.set('top', baseHeight * 8)
        } else {
          group.set('top', baseHeight * 16)
        }
        // group.setCoords()
      }

      // console.log(group)
      group.filter((n) => !n.isDefaultCell()).map((o) => group.remove(o))
      group._objects.filter((o) => o._objects).map((o) => {
        // console.log(o)
        o._objects[0].set('fill', 'white')
        if (o._objects[1])
          if (surfaceLabel) {
            o._objects[1].set('opacity', 1)
          } else {
            o._objects[1].set('opacity', 0)
          }
      })
      // const root = this.canvas._objects.find(
      //   (t) =>
      //     t.name === `${cellPrefix}${index}outsidebottom` ||
      //     t.name === `${cellPrefix}${index}outsidetop`,
      // )
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

      _.orderBy(
        data.filter(
          (m) => m.toothIndex === index && m.target === group.name, // && !m.hide,
        ),
        [
          'timestamp',
        ],
        [
          'asc',
        ],
      ).map((o) => {
        // console.log(o)
        const target = buttonConfigs.find((m) => m.value === o.value)
        if (target) {
          if (target.getShape && o.target === group.name) {
            // console.log('getShape')

            let newShape = target.getShape({
              canvas: this.canvas,
              group,
              config: o,
            })
            let existed = group.filter((x) => x.name === o.value)[0]
            // console.log(group)
            if (!existed && newShape && newShape.set) {
              // console.log(newShape)
              newShape.set('name', o.value)
              group.add(newShape)
              existed = newShape
            }
            if (existed) existed.bringToFront()
          } else if (target.type === 'cell') {
            // console.log(group.filter((n) => n.isValidCell()), o)
            // console.log(group)
            let cell = group
              .filter((n) => n.isValidCell())
              .find((t) => t.name === o.subTarget)
            if (cell) {
              cell._objects[0].set('fill', target.fill)
              // console.log(group._objects, group.filter((n) => n.isShape))
            }
            group.filter((n) => n.isShape).map((n) => {
              // console.log(n)
              group.remove(n)
            })
            // toothIndex: index,
            // target: text[4],
            // name: `${cellPrefix}centerLeft`,
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

    this.canvas
      .getObjects('group')
      .filter((n) => n.name && n.name.indexOf('outside') > 0)
      .map((o) => {
        o.item(0).set('fill', 'white')
        // o.set('opacity', 1)
        // console.log(o)
        if (o.index > 30 && o.index < 50) {
          if (!pedoChart) {
            o.set('top', baseHeight * 11 - strokeWidth)

            // o.set('top', (o.orgY || o.top) - baseHeight * 9)
          } else {
            o.set('top', baseHeight * 19 - strokeWidth)
            // console.log(o.top)
            // o.set('orgY', o.top)
          }
        }
      })
    // if (onSelect) {
    //   onSelect({ canvas: this.canvas })
    // }
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
      // console.log(item, group)
      debouncedAction(() => {
        this.props.dispatch({
          type: 'dentalChartComponent/toggleSelect',
          payload: {
            toothIndex: group.index || item.toothIndex,
            value: action.value,
            target: group.name,
            subTarget: item.name,
            forceSelect: select,
            name:
              item.isValidCell && item.isValidCell()
                ? item.item(0).name
                : item.name,
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
      // console.log(ary)
      debouncedAction(() => {
        this.props.dispatch({
          type: 'dentalChartComponent/toggleMultiSelect',
          payload: ary.map(({ group, item = {}, select }) => {
            // console.log(item)
            console.log(group, group.name)

            return {
              toothIndex: group.index || item.toothIndex,
              value: action.value,
              target: group.name,
              subTarget: item.name,
              forceSelect: select,
              name:
                item.isValidCell && item.isValidCell()
                  ? item.item(0).name
                  : item.name,
              prevColor:
                item.isValidCell && item.isValidCell() ? item.item(0).fill : '',
            }
          }),
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
    const { data = {}, pedoChart, surfaceLabel } = dentalChartComponent
    // if (this.divContainer.current) {
    //   console.log(this.divContainer.current.offsetWidth)
    // }
    return (
      <div ref={this.divContainer} style={{ width: '100%' }}>
        <Paper elevation={0} className={classes.paper}>
          <canvas id={this.id} ref={this._canvasContainer} />
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Chart)
