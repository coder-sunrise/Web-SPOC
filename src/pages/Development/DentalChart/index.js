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
      },
      {
        index: 17,
        text: text1,
      },
      {
        index: 16,
        text: text1,
      },
      {
        index: 15,
        text: text1,
      },
      {
        index: 14,
        text: text2,
      },
      {
        index: 13,
        text: text2,
      },
      {
        index: 12,
        text: text2,
      },
      {
        index: 11,
        text: text2,
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

    const canvas = new fabric.Canvas(this._canvasContainer.current, {
      // preserveObjectStacking: true,
      width: this.divContainer.current.offsetWidth,
      height: this.props.global.mainDivHeight - 50,
      // renderOnAddRemove: false,
      // skipTargetFind: true
      name: 'container',
    })

    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.noScaleCache = false
    // console.log(logo, index, text)
    canvas.hoverCursor = 'default'

    this.canvas = canvas
    const { data = {} } = this.props.dentalChartComponent

    this.configs.map((o, order) => {
      this.addGroup({
        ...o,
        order,
        values: data.filter((m) => m.toothIndex === o.index),
        ...this.props,
      })
    })
    this.renderCanvas(this.props)

    // this.canvas.on('mouse:down', (e) => {
    //   console.log('mouse:down', e)
    // })
    // this.canvas.on('mouse:move', (e) => {
    //   // console.log('mouse:move', e)
    // })
    this.canvas.on('selection:created', ({ selected, e, target }) => {
      if (!target) return
      target.set(lockConfig)

      if (!this.props.dentalChartComponent.action) return
      console.log('selection:created')
      if (this.props.dentalChartComponent.action.type !== 'cell') {
        this.canvas.setActiveObject(selected[0], e)
        this.toggleMultiSelect(
          selected.map((g) => ({
            group: g,
            select: true,
          })),
        )
      }

      // console.log('selection:created', rest)
    })
  }

  componentWillReceiveProps (nextProps) {
    const { dentalChartComponent } = nextProps
    // console.log(
    //   _.isEqual(dentalChartComponent, this.props.dentalChartComponent),
    // )
    if (!_.isEqual(dentalChartComponent, this.props.dentalChartComponent)) {
      this.renderCanvas(nextProps)
    }
  }

  addGroup = ({ text, index, order, values, dentalChartComponent }) => {
    const groupWidth = baseWidth * 4 // + strokeWidth
    const groupHeight = baseHeight * 6 // + strokeWidth

    const cfg = {
      fill: '#ffffff',
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

    const headerText = new fabric.IText(`${index}`, {
      left: -`${index}`.length * 9,
      top: -groupHeight / 2 - 12,
      // top: -groupHeight / 2 + 8,
      // originX: 'center',
      // originY: 'center',
      fontSize: 26,
      ...fontCfg,
    })
    const polygonText = new fabric.IText(text[0], {
      left: baseWidth / 2 - innerFontSize / 4,
      top: baseHeight * 3.5 - innerFontSize / 2,
      fontSize: innerFontSize,
      ...fontCfg,
    })
    const polygon2Text = new fabric.IText(text[1], {
      left: baseWidth * 2 - innerFontSize / 4,
      top: baseHeight * 5 - innerFontSize * 1.5,
      fontSize: innerFontSize,
      ...fontCfg,
    })

    const polygon3Text = new fabric.IText(text[2], {
      left: baseWidth * 4 - innerFontSize * 1.5,
      top: baseHeight * 3.5 - innerFontSize / 2,
      fontSize: innerFontSize,
      ...fontCfg,
    })
    const polygon4Text = new fabric.IText(text[3], {
      left: baseWidth * 2 - innerFontSize / 4,
      top: baseHeight * 2 + innerFontSize / 2,
      fontSize: innerFontSize,
      ...fontCfg,
    })

    const g1 = new fabric.Group(
      [
        polygon,
        polygonText,
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
        polygon2Text,
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
        polygon3Text,
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
        polygon4Text,
      ],
      {
        ...groupCfg,
        name: `${cellPrefix}top`,
        top: baseHeight * 2,
      },
    )

    const g11 = new fabric.Group(
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
            ...cfg,
          },
        ),
      ],
      {
        ...groupCfg,
        // opacity: 0.1,
        name: `${cellPrefix}outsidetop`,

        top: baseHeight,
      },
    )
    g11.rotate(180)

    const g12 = new fabric.Group(
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

        top: baseHeight * 5,
      },
    )

    let g5
    let g6
    let g7
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
      const polygon5Text = new fabric.IText(text[4], {
        left: baseWidth / 2 + baseWidth - innerFontSize / 4,
        top: baseHeight * 3.5 - innerFontSize / 2,
        fontSize: innerFontSize,
        ...fontCfg,
      })
      const polygon6Text = new fabric.IText(text[5], {
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
      const polygon7Text = new fabric.IText(text[4], {
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

    const fixedItems = [
      // headerText,
      g1,
      g2,
      g3,
      g4,
      g11,
      g12,
      // groupt,
    ]
    if (g7) {
      fixedItems.push(g7)
    } else {
      fixedItems.push(g5)
      fixedItems.push(g6)
    }
    const group = new fabric.Group(fixedItems, {
      ...groupCfg,
      ...lockConfig,

      width: groupWidth,
      height: groupHeight,
      // padding: 300,
      left: order * groupWidth + 1,
      // top: 150,
      // originX: 'left',

      // originY: 'center',
      subTargetCheck: true,
      selectable: true,
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

    this.canvas.add(group)
  }

  renderCanvas = (props) => {
    console.log('renderCanvas', props.dentalChartComponent.data)
    const { dentalChartComponent, dispatch } = props
    const { action = {}, data } = dentalChartComponent
    const { icon, type, hoverColor: hc, render, clear } = action

    this.canvas
      .getObjects('group')
      .filter((n) => Number(n.name) > 0)
      .map((group) => {
        group.filter((n) => !n.isDefaultCell()).map((o) => group.remove(o))
        group
          .filter((n) => n.isValidCell())
          .map((o) => o.item(0).set('fill', 'white'))
        group.off('mouseup')
        group.on('mouseup', (e) => {
          console.log('gesture', e)
          // console.log(action, dentalChartComponent)
          if (action.onClick) {
            action.onClick({ group, dispatch })
          } else if (action && overlayShapeTypes.includes(action.value)) {
            this.toggleSelect({ group })
          } else if (e.subTargets[0] && !e.subTargets[0].isValidCell()) {
            this.toggleSelect({ group })
          }
        })
        group.filter((n) => n.isValidCell()).map((item) => {
          item.off('mouseup')
          item.on('mouseup', (e) => {
            console.log('cell gesture', e)
            if (action && action.type === 'cell')
              this.toggleSelect({ item, group })
            // if (e.target) {
            //   const item = group.object(value)

            //   if (
            //     item // &&
            //     // e.target.canvas // &&
            //     // checkIsValidElement(item, name, config.isValidElement)
            //   ) {
            //     toggleSelect({ item, selected, config, values, dispatch, group })
            //   }
            // }
          })
        })

        data.filter((m) => m.toothIndex === Number(group.name)).map((o) => {
          const target = buttonConfigs.find((m) => m.value === o.value)
          if (target) {
            if (target.getShape) {
              let newShape = target.getShape()
              let existed = group.filter((x) => x.name === o.value)[0]
              if (!existed) {
                newShape.set('name', o.value)
                group.add(newShape)
                existed = newShape
              }

              existed.bringToFront()
            } else if (target.type === 'cell') {
              const cell = group
                .filter((n) => n.isValidCell())
                .find((t) => t.name === o.target)
              if (cell) cell.item(0).set('fill', target.fill)
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

    this.canvas.renderAll()

    // fabric.Image.fromURL('../assets/pug.jpg', function(img) {
    //   var oImg = img.set({ left: 0, top: 0}).scale(0.25);
    //   canvas.add(oImg);
    // });
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
      ...props
    } = this.props
    const { data = {} } = dentalChartComponent
    return (
      <div className={className}>
        <GridContainer>
          <GridItem md={8}>
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
          <GridItem md={4}>test</GridItem>
        </GridContainer>

        <ButtonGroup {...this.props} />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(DentalChart)
