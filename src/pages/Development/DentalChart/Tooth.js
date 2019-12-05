import React, { useState, useEffect, useRef } from 'react'
import { withStyles, Divider, Paper } from '@material-ui/core'
import { Field, FastField } from 'formik'
import _ from 'lodash'
import DeleteIcon from '@material-ui/icons/Delete'
import AttachMoney from '@material-ui/icons/AttachMoney'
import FilterList from '@material-ui/icons/FilterList'
import moment from 'moment'
// import logo from '@/assets/img/dentalChart/clear.png'

// import clear from '@/assets/img/dentalChart/clear.png'
// import missing from '@/assets/img/dentalChart/missing.png'
// import caries from '@/assets/img/dentalChart/caries.png'
// import recurrentdecay from '@/assets/img/dentalChart/recurrentdecay.png'
// import nccl from '@/assets/img/dentalChart/nccl.png'
// import fractured from '@/assets/img/dentalChart/fractured.png'
// import filling from '@/assets/img/dentalChart/filling.png'
// import temporarydressing from '@/assets/img/dentalChart/temporarydressing.png'
// import onlayveneer from '@/assets/img/dentalChart/onlayveneer.png'

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
} from './variables'

const { fabric } = require('fabric')

class Tooth extends React.PureComponent {
  constructor (props) {
    super(props)

    this._canvas = React.createRef()
    this.divContainer = React.createRef()

    this.hoverColor = '#ffffff'
    this.hoverOpacity = 1
    this.backgroudImage = null

    this.id = getUniqueId()
  }

  componentDidMount () {
    this.initCanvas()
    // this.renderCanvas(this.props)
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

  renderCanvas = (props) => {
    console.log('renderCanvas', props.values)
    const { dentalChartComponent } = props
    const { action = {} } = dentalChartComponent
    const { icon, type, hoverColor: hc, render, clear } = action
    if (clear) clear(this.canvas, props)
    this.canvas.getObjects('group').map((o) => {
      if (o.name === 'cell') {
        if (icon && type !== 'cell') {
          // item.set('hoverCursor', `url(${icon}),pointer`)
          this.hoverOpacity = 0
        } else {
          // item.set('hoverCursor', `auto`)
          this.hoverOpacity = 1
        }
        if (hc) {
          this.hoverColor = hc
        } else {
          this.hoverColor = '#ffffff'
        }
      }
    })
    if (render) render(this.canvas, props)

    this.canvas.off('mouse:over')
    this.canvas.on('mouse:over', (e) => {
      // console.log(e, e.target)
      if (e.target && e.target.item) {
        const item = e.target.item(0)
        if (item) {
          item.set('fill', this.hoverColor)
          this.canvas.getObjects('group').map((o) => {
            if (o.name === 'cell') o.set('opacity', this.hoverOpacity)
          })
          this.canvas.renderAll()
        }
      }
    })
    this.canvas.off('mouse:out')
    this.canvas.on('mouse:out', (e) => {
      if (e.target && e.target.item) {
        const item = e.target.item(0)
        if (item) {
          item.set('fill', 'white')
          this.canvas.getObjects('group').map((o) => {
            if (o.name === 'cell') o.set('opacity', 1)
          })

          this.canvas.renderAll()
        }
      }
    })

    // if (icon) {
    //   fabric.Image.fromURL(icon, (img) => {
    //     console.log(img)
    //     if (this.backgroudImage) {
    //       this.canvas.remove(this.backgroudImage)
    //     }
    //     this.backgroudImage = img.set({ left: 0, top: 0 }).scale(1)
    //     this.canvas.add(this.backgroudImage)
    //   })
    // }
    this.canvas.renderAll()

    // fabric.Image.fromURL('../assets/pug.jpg', function(img) {
    //   var oImg = img.set({ left: 0, top: 0}).scale(0.25);
    //   canvas.add(oImg);
    // });
  }

  initCanvas = () => {
    const { index, text, dentalChartComponent } = this.props
    const { action = {} } = dentalChartComponent
    const { icon } = action

    // console.log(action)
    const canvas = new fabric.Canvas(this._canvas.current, {
      // preserveObjectStacking: true,
      width: (baseWidth * 4 + strokeWidth) * zoom,
      height: (baseHeight * 6 + strokeWidth) * zoom,
      // renderOnAddRemove: false,
      // skipTargetFind: true
      name: index,
    })
    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.noScaleCache = false
    // console.log(logo, index, text)
    canvas.hoverCursor = 'default'
    // console.log(canvas.hoverCursor)

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
      left: baseWidth * 2 - `${index}`.length * 9,
      top: 8,
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
    canvas.add(headerText)

    canvas.add(
      new fabric.Group(
        [
          polygon,
          polygonText,
        ],
        groupCfg,
      ),
    )
    canvas.add(
      new fabric.Group(
        [
          polygon2,
          polygon2Text,
        ],
        groupCfg,
      ),
    )
    canvas.add(
      new fabric.Group(
        [
          polygon3,
          polygon3Text,
        ],
        groupCfg,
      ),
    )
    canvas.add(
      new fabric.Group(
        [
          polygon4,
          polygon4Text,
        ],
        groupCfg,
      ),
    )
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
      canvas.add(
        new fabric.Group(
          [
            polygon5,
            polygon5Text,
          ],
          groupCfg,
        ),
      )
      canvas.add(
        new fabric.Group(
          [
            polygon6,
            polygon6Text,
          ],
          groupCfg,
        ),
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
      canvas.add(
        new fabric.Group(
          [
            polygon7,
            polygon7Text,
          ],
          groupCfg,
        ),
      )
    }

    const polygon12 = new fabric.Polygon( // outside top
      [
        { x: 0, y: baseHeight },

        { x: baseWidth * 1, y: 0 },

        { x: baseWidth * 3, y: 0 },
        { x: baseWidth * 4, y: baseHeight },
      ],
      {
        ...cfg,
        fill: 'brown',
        top: baseHeight * 5,
      },
    )
    polygon12.rotate(180)

    canvas.add(polygon12)

    // canvas.on('mouse:over', (e) => {
    //   // console.log(e, e.target)
    //   if (e.target && e.target.item) {
    //     const item = e.target.item(0)
    //     if (item) {
    //       item.set('fill', this.hoverColor)
    //       canvas.getObjects('group').map((o) => {
    //         if (o.name === 'cell') o.set('opacity', this.hoverOpacity)
    //       })
    //       canvas.renderAll()
    //     }
    //   }
    // })

    // canvas.on('mouse:out', (e) => {
    //   if (e.target && e.target.item) {
    //     const item = e.target.item(0)
    //     if (item) {
    //       item.set('fill', 'white')
    //       canvas.getObjects('group').map((o) => {
    //         if (o.name === 'cell') o.set('opacity', 1)
    //       })

    //       canvas.renderAll()
    //     }
    //   }
    // })
    canvas.setZoom(zoom)
    this.canvas = canvas
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
      mode,
      onDataSouceChange,
      ...props
    } = this.props
    // console.log(this.canvas)
    return (
      <canvas id={this.id} ref={this._canvas}>
        Sorry, Canvas HTML5 element is not supported by your browser :(
      </canvas>
    )
  }
}

export default Tooth
