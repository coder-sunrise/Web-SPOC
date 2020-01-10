import React, { useState, useEffect, useRef } from 'react'
import { withStyles, Divider, Paper } from '@material-ui/core'
import { connect } from 'dva'
import { saveAs } from 'file-saver'
import _ from 'lodash'
import DeleteIcon from '@material-ui/icons/Delete'
import AttachMoney from '@material-ui/icons/AttachMoney'
import CloudDownload from '@material-ui/icons/CloudDownload'
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
  addonGroupCfg,
  cellPrefix,
  overlayShapeTypes,
  lockConfig,
  selectablePrefix,
  groupWidth,
  groupHeight,
  createToothShape,
  createFont,
  createTriangle,
  createRectangle,
  createCircle,
  createLine,
} from './variables'

const { fabric } = require('fabric')

let selectedTooth = []
const imageCache = {}
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
const text1l1 = {
  left: 'd',
  bottom: 'p',
  right: 'm',
  top: 'b',
  centerLeft: 'o',
  centerRight: 'o',
}
const text1l2 = {
  left: 'd',
  bottom: 'p',
  right: 'm',
  top: 'b',
  centerfull: 'i',
}
const text1r1 = {
  left: 'd',
  bottom: 'p',
  right: 'm',
  top: 'b',
  centerLeft: 'o',
  centerRight: 'o',
}
const text1r2 = {
  left: 'm',
  bottom: 'p',
  right: 'd',
  top: 'b',
  centerfull: 'i',
}

const text2l1 = {
  left: 'd',
  bottom: 'b',
  right: 'm',
  top: 'l',
  centerLeft: 'o',
  centerRight: 'o',
}
const text2l2 = {
  left: 'd',
  bottom: 'b',
  right: 'm',
  top: 'l',
  centerfull: 'i',
}
const text2r1 = {
  left: 'd',
  bottom: 'b',
  right: 'm',
  top: 'l',
  centerLeft: 'o',
  centerRight: 'o',
}
const text2r2 = {
  left: 'm',
  bottom: 'b',
  right: 'd',
  top: 'l',
  centerfull: 'i',
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
const isUpperSection = (index) => {
  return (index > 0 && index < 30) || (index > 50 && index < 70)
}

class Chart extends React.Component {
  state = {
    container: null,
    bridgingTooths: [],
  }

  constructor (props) {
    super(props)
    this._canvasContainer = React.createRef()

    this.divContainer = React.createRef()

    this.configs = [
      {
        index: 18,
        text: text1l1,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 17,
        text: text1l1,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 16,
        text: text1l1,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 15,
        text: text1l1,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 14,
        text: text1l2,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 13,
        text: text1l2,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 12,
        text: text1l2,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 11,
        text: text1l2,
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
        text: text1r2,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 22,
        text: text1r2,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 23,
        text: text1r2,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 24,
        text: text1r2,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 25,
        text: text1r1,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 26,
        text: text1r1,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 27,
        text: text1r1,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 28,
        text: text1r1,
        top: true,
        line: 0,
        posAjustTop: baseHeight * 4,
      },
      {
        index: 55,
        pedo: true,
        left: 3,
        text: text1l1,
        line: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        index: 54,
        pedo: true,
        left: 3,
        text: text1l1,
        line: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        index: 53,
        pedo: true,
        text: text1l2,
        left: 3,
        line: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        index: 52,
        pedo: true,
        text: text1l2,
        left: 3,
        line: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        index: 51,
        pedo: true,
        text: text1l2,
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
        text: text1r2,
        left: 3,
        line: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        index: 62,
        pedo: true,
        text: text1r2,
        left: 3,
        line: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        index: 63,
        pedo: true,
        text: text1r2,
        left: 3,
        line: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        index: 64,
        pedo: true,
        left: 3,
        text: text1r1,
        line: 1,
        posAjustTop: baseHeight * 5,
      },
      {
        index: 65,
        pedo: true,
        text: text1r1,
        left: 3,
        line: 1,
        posAjustTop: baseHeight * 5,
      },

      {
        index: 85,
        pedo: true,
        left: 3,
        text: text2l1,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 84,
        pedo: true,
        left: 3,
        text: text2l1,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 83,
        pedo: true,
        text: text2l2,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 82,
        pedo: true,
        text: text2l2,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 81,
        pedo: true,
        text: text2l2,
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
        text: text2r2,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 72,
        pedo: true,
        text: text2r2,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 73,
        pedo: true,
        text: text2r2,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 74,
        pedo: true,
        left: 3,
        text: text2r1,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 75,
        pedo: true,
        text: text2r1,
        left: 3,
        line: 2,
        posAjustTop: baseHeight * 5.5,
      },
      {
        index: 48,
        text: text2l1,
        bottom: true,
        line: 3,
      },
      {
        index: 47,
        text: text2l1,
        bottom: true,
        line: 3,
      },
      {
        index: 46,
        text: text2l1,
        bottom: true,
        line: 3,
      },
      {
        index: 45,
        text: text2l1,
        bottom: true,
        line: 3,
      },
      {
        index: 44,
        text: text2l2,
        bottom: true,
        line: 3,
      },
      {
        index: 43,
        text: text2l2,
        bottom: true,
        line: 3,
      },
      {
        index: 42,
        text: text2l2,
        bottom: true,
        line: 3,
      },
      {
        index: 41,
        text: text2l2,
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
        text: text2r2,
        bottom: true,
        line: 3,
      },
      {
        index: 32,
        text: text2r2,
        bottom: true,
        line: 3,
      },
      {
        index: 33,
        text: text2r2,
        bottom: true,
        line: 3,
      },
      {
        index: 34,
        text: text2r2,
        bottom: true,
        line: 3,
      },
      {
        index: 35,
        text: text2r1,
        bottom: true,
        line: 3,
      },
      {
        index: 36,
        text: text2r1,
        bottom: true,
        line: 3,
      },
      {
        index: 37,
        text: text2r1,
        bottom: true,
        line: 3,
      },
      {
        index: 38,
        text: text2r1,
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
      backgroundColor: 'white',
    })
    canvas.setZoom(width / 2200)
    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.noScaleCache = false
    // console.log(logo, index, text)
    canvas.hoverCursor = 'default'

    this.canvas = canvas
    const { data = {}, pedoChart } = this.props.dentalChartComponent
    const { dispatch, readOnly } = this.props
    // console.log()
    const groups = _.groupBy(this.configs, 'line')
    Object.keys(groups).forEach((k) => {
      groups[k].map((o, order) => {
        // console.log(o, this.props)
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
          p.add(
            createFont({
              text: '',
              left: innerFontSize / 2,
              top: -baseHeight,
              fontSize: innerFontSize * 2,
            }).rotate(180),
          )
          p.add(
            createFont({
              text: '',
              left: innerFontSize / 2,
              top: -baseHeight,
              fontSize: innerFontSize * 2,
            }).rotate(180),
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
            if (action && action.chartMethodTypeFK !== 3)
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
          p.add(
            createFont({
              text: '',
              left: innerFontSize / 2,
              top: -baseHeight,
              fontSize: innerFontSize * 2,
            }),
          )
          p.add(
            createFont({
              text: '',
              left: -innerFontSize / 2,
              top: -baseHeight,
              fontSize: innerFontSize * 2,
            }),
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
            if (action && action.chartMethodTypeFK !== 3)
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
            if (
              action.chartMethodTypeFK === 1 &&
              e.subTargets &&
              e.subTargets[0].isShape
            ) {
              group.filter((o) => o.isShape).map((o) => {
                group.remove(o)
              })
              this.canvas.renderAll()
              return
            }

            // console.log(action, dentalChartComponent)
            if (action.chartMethodTypeFK === 1) {
              // console.log(e.subTargets[0], group)
              // const existShapes = group.filter((o) => o.isShape)
              // if (existShapes.length > 0) {
              //   existShapes.map((o) => group.remove(o))
              //   this.canvas.renderAll()
              // } else {

              // }
              // console.log(e.subTargets[0])
              if (e.subTargets[0].isDefaultCell())
                this.toggleSelect({ item: e.subTargets[0], group })
            } else if (
              [
                2,
                4,
              ].includes(action.chartMethodTypeFK)
            ) {
              this.toggleSelect({
                group,
                item: {
                  name: 'tooth',
                },
              })
            } else if (action.chartMethodTypeFK === 3) {
              if (selectedTooth.length < 2) {
                if (selectedTooth.length === 0) {
                  group.add(
                    new fabric.Group(
                      [
                        createCircle(),
                      ],
                      {
                        // ...sharedCfg,
                        name: `bridgeStartPoint`,
                        // toothIndex: index,
                      },
                    ),
                  )
                }

                if (selectedTooth.length === 1) {
                  if (selectedTooth[0].line !== group.line) return
                }
                selectedTooth.push(group)
              }
              // console.log(group)

              if (selectedTooth.length === 2) {
                selectedTooth = _.orderBy(selectedTooth, (o) => Number(o.name))
                // console.log(selectedTooth)
                const items = this.canvas
                  .getObjects('group')
                  .filter((n) =>
                    this.isToothCrossed(n, selectedTooth[0], selectedTooth[1]),
                  )
                if (items.length < 2) return
                this.toggleMultiSelect(
                  items.map((g) => ({
                    group: g,
                    item: {
                      name: 'tooth',
                      nodes: selectedTooth.map((o) => Number(o.name)),
                    },
                    select: true,
                  })),
                )
              }
              this.canvas.renderAll()
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
      // console.log(selected)
      // return
      // console.log(target.type)
      // return
      this.canvas.discardActiveObject()
      const { action } = this.props.dentalChartComponent

      if (!action || readOnly) return
      // console.log(action)
      if (action.chartMethodTypeFK === 3) return
      setTimeout(() => {
        // console.log('selection:created, mouseMoved', e, target)
        if (
          !mouseMoved ||
          !target ||
          (target.name && target.name.indexOf(selectablePrefix) === 0)
        )
          return
        target.set(lockConfig)

        if (this.props.dentalChartComponent.action.chartMethodTypeFK !== 1) {
          // console.log(selected)
          this.toggleMultiSelect(
            selected
              .filter((o) => o._objects && o._objects.length)
              .map((g) => ({
                group: g,
                item:
                  g._objects.filter(
                    (o) => o.name && o.name.indexOf(`${cellPrefix}`) === 0,
                  ).length === 1
                    ? g._objects[0]
                    : {
                        name: 'tooth',
                      },

                select: true,
              })),
          )
        } else if (
          this.props.dentalChartComponent.action.chartMethodTypeFK === 1
        ) {
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
    const { dentalChartComponent, global, readOnly } = nextProps
    // console.log(
    //   'componentWillReceiveProps',
    //   _.isEqual(dentalChartComponent, this.props.dentalChartComponent),
    // )
    if (
      !readOnly &&
      !_.isEqual(dentalChartComponent, this.props.dentalChartComponent)
    ) {
      // this.unbindCanvas(this.props)
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

    const width = this.divContainer.current.offsetWidth // - 4
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
    posAjustTop = 0,
    height,
    width,
  }) => {
    // console.log(text, index, order, width, height, left, line, posAjustTop)
    this.canvas.add(
      createToothShape({
        text,
        index,
        order,
        width,
        height,
        left,
        line,
        posAjustTop,
      }),
    )
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
    const { dentalChartComponent, dentalChartSetup, dispatch, readOnly } = props
    const { action = {}, data, pedoChart, surfaceLabel } = dentalChartComponent
    const { list = [] } = dentalChartSetup
    const { icon, type, hoverColor: hc, onSelect, clear } = action

    if (action.chartMethodTypeFK === 3) {
      selectedTooth = []

      this.canvas._objects
        .filter((o) => o.name === 'bridgeLine')
        .map((o) => this.canvas.remove(o))
    }
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

        return false
      }
      // console.log(group._objects.find((m) => m.name === `header_${index}`))
      group.set('opacity', 1)

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
        o._objects[0].set('fill', 'transparent')
        if (o._objects[1])
          if (surfaceLabel) {
            o._objects[1].set('opacity', 1)
          } else {
            o._objects[1].set('opacity', 0)
          }
        if (o._objects[2] instanceof fabric.IText) o._objects[2].set('text', '')
      })

      const toothItems = data.filter(
        (m) => m.toothIndex === index && m.target === group.name, // && !m.hide,
      )
      _.orderBy(
        toothItems,
        [
          'timestamp',
        ],
        [
          'asc',
        ],
      ).map((o, i) => {
        const target = list.find((m) => m.id === o.id)
        if (target) {
          // console.log(target, o, group, toothItems.length, i)

          if (
            target.editMode === 'image' &&
            target.image &&
            o.target === group.name
          ) {
            // console.log('getShape')

            // let newShape = target.getShape()
            let existed = imageCache[o.id] // group.filter((x) => x.name === o.id)[0]
            // console.log(group)
            if (!existed) {
              // console.log(newShape)
              fabric.Image.fromURL(target.image, (img) => {
                const d = new fabric.Group(
                  [
                    img
                      .scale(groupWidth / img.width)
                      .rotate(isUpperSection(index) ? 180 : 0),
                  ],
                  {
                    ...addonGroupCfg,
                    isShape: true,
                    name: `${o.id}`,
                  },
                )
                if (toothItems.length - 1 !== i) {
                  group._objects.splice(
                    group._objects.filter((k) => k.isShape).length,
                    0,
                    d,
                  )
                } else {
                  group.add(d)
                }
                imageCache[o.id] = img.scale(groupWidth / img.width)
                this.canvas.renderAll()
              })
            }
            if (existed) {
              const d = new fabric.Group(
                [
                  fabric.util.object
                    .clone(existed)
                    .rotate(isUpperSection(index) ? 180 : 0),
                ],
                {
                  ...addonGroupCfg,
                  isShape: true,
                  name: `${o.id}`,
                },
              )
              if (d)
                if (toothItems.length - 1 !== i) {
                  group._objects.splice(
                    group._objects.filter((k) => k.isShape).length,
                    0,
                    d,
                  )
                } else {
                  group.add(d)
                }
            }
          } else if (
            [
              2,
              4,
            ].includes(target.chartMethodTypeFK) &&
            (target.editMode === 'color' || !target.editMode)
          ) {
            // console.log(group)
            // console.log(group.filter((n) => n.isShape))
            // console.log(group._objects.filter((n) => n.isShape))

            // group.filter((n) => n.isShape).map((n) => {
            //   // console.log(n)
            //   group.remove(n)
            // })

            let shape = new fabric.Group([
              o.subTarget === 'tooth'
                ? createRectangle({
                    fill: target.chartMethodColorBlock,
                  })
                : createTriangle({
                    fill: target.chartMethodColorBlock,
                  }),
              createFont({
                text: target.chartMethodText || '',
                left: groupWidth / 2 - innerFontSize / 1.8,
                top: groupHeight / 2 - innerFontSize,
                fontSize: innerFontSize * 2,
              }),
            ])
            const d = new fabric.Group(
              [
                shape,
              ],
              {
                ...addonGroupCfg,
                isShape: true,
                name: `${o.id}`,
              },
            )
            if (d)
              if (toothItems.length - 1 !== i) {
                group._objects.splice(
                  group._objects.filter((k) => k.isShape).length,
                  0,
                  d,
                )
              } else {
                group.add(d)
              }

            // console.log(group)
            // if (toothItems.length - 1 !== i) d.sendToBack()
          } else if (target.chartMethodTypeFK === 1) {
            // console.log(group.filter((n) => n.isValidCell()), o)
            // console.log(group)
            let cell = group
              .filter((n) => n.isValidCell())
              .find((t) => t.name === o.subTarget)
            if (cell) {
              // console.log(target, cell, group)
              cell._objects[0].set('fill', target.chartMethodColorBlock)
              if (
                cell._objects[2] &&
                cell._objects[2] instanceof fabric.IText
              ) {
                cell._objects[2].set('text', target.chartMethodText || '')
              }
              // if(target.chartMethodText)
              // cell.add(new fabric.IText(target.chartMethodText || '', {
              //   0,
              //   0,
              //   fontSize: innerFontSize,
              //   ...fontCfg,
              // }))
              // console.log(group._objects, group.filter((n) => n.isShape))
            }
            group.filter((n) => n.isShape).map((n) => {
              // console.log(n)
              // group.remove(n)
            })
            // toothIndex: index,
            // target: text[4],
            // name: `${cellPrefix}centerLeft`,
          } else if (
            [
              3,
            ].includes(target.chartMethodTypeFK) &&
            o.nodes
          ) {
            // if (target) console.log(3, target, data, o)
            if (o.toothIndex === o.nodes[0]) {
              setTimeout(() => {
                const start = this.canvas._objects.find(
                  (m) => Number(m.name) === o.nodes[0],
                )
                const end = this.canvas._objects.find(
                  (m) => Number(m.name) === o.nodes[1],
                )
                // console.log(start, end)
                const line = createLine([
                  start.translateX,
                  start.translateY,
                  end.translateX,
                  end.translateY,
                  // 10,
                  // 10,
                  // 30,
                  // 30,
                ])
                // console.log(group, line)

                this.canvas.add(
                  new fabric.Group(
                    [
                      line,
                      // createCircle(),
                    ],
                    {
                      name: `bridgeLine`,
                    },
                  ),
                )
              }, 0)
            }
          }
          if (target.render) {
            target.render({ group, canvas: this.canvas })
          }
        }
      })

      // console.log(group)

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
        o.item(0).set('fill', 'transparent')
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
    // console.log(this.canvas)
    // fabric.Image.fromURL(logo, (img) => {
    //   let oImg = img.set({ left: 0, top: 0 }).scale(0.25)
    //   this.canvas.add(oImg)
    // })

    // console.log(this.canvas)
  }

  toggleSelect = ({ item = {}, group, select }) => {
    const { dentalChartComponent, readOnly } = this.props
    if (readOnly) return
    const { action } = dentalChartComponent
    if (action && action.id) {
      // console.log(item, group)
      debouncedAction(() => {
        this.props.dispatch({
          type: 'dentalChartComponent/toggleSelect',
          payload: {
            toothIndex: group.index || item.toothIndex,
            id: action.id,
            action,
            target: group.name,
            subTarget: item.name,
            forceSelect: select,
            name:
              item.isValidCell && item.isValidCell()
                ? item.item(0).name
                : item.name,
            prevColor:
              item.isValidCell && item.isValidCell() ? item.item(0).fill : '',
            nodes: item.nodes,
          },
        })
      })
    }
  }

  toggleMultiSelect = (ary) => {
    const { dentalChartComponent, readOnly } = this.props
    if (readOnly) return
    const { action } = dentalChartComponent
    if (action && action.id) {
      // console.log(ary)
      debouncedAction(() => {
        this.props.dispatch({
          type: 'dentalChartComponent/toggleMultiSelect',
          payload: ary.map(({ group, item = {}, select }) => {
            // console.log(item)
            // console.log(group, group.name)

            return {
              toothIndex: group.index || item.toothIndex,
              id: action.id,
              action,
              target: group.name,
              subTarget: item.name,
              forceSelect: select,
              name:
                item.isValidCell && item.isValidCell()
                  ? item.item(0).name
                  : item.name,
              prevColor:
                item.isValidCell && item.isValidCell() ? item.item(0).fill : '',
              nodes: item.nodes,
            }
          }),
        })
      })
    }
  }

  isToothCrossed = (n, start, end) => {
    // console.log(n, start, end)
    const startChar1 = start.name.substring(0, 1)
    const endChar1 = end.name.substring(0, 1)
    if (!n.name || !Number(n.name)) return false
    if (startChar1 === endChar1) {
      return (
        (Number(n.name) >= Number(start.name) &&
          Number(n.name) <= Number(end.name)) ||
        (Number(n.name) >= Number(end.name) &&
          Number(n.name) <= Number(start.name))
      )
    }
    if (n.name.substring(0, 1) === startChar1) {
      return (
        Number(n.name) > Number(`${startChar1}0`) &&
        Number(n.name) <= Number(start.name)
      )
    }
    if (n.name.substring(0, 1) === endChar1) {
      return (
        Number(n.name) > Number(`${endChar1}0`) &&
        Number(n.name) <= Number(end.name)
      )
    }

    return false
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
      // value,
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
      <div
        ref={this.divContainer}
        style={{ width: '100%', position: 'relative', ...style }}
      >
        <Tooltip title='Save to local'>
          <Button
            justIcon
            color='primary'
            style={{
              position: 'absolute',
              zIndex: 100,
              right: 0,
              bottom: 8,
            }}
            onClick={() => {
              this._canvasContainer.current.toBlob((blob) => {
                saveAs(blob, 'dentalchart.png')
              }, 'image/png')
            }}
          >
            <CloudDownload />
          </Button>
        </Tooltip>
        <Paper className={classes.paper}>
          <canvas id={this.id} ref={this._canvasContainer} />
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Chart)
