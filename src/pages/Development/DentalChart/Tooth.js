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
  cellPrefix,
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

    if (render) render(this.canvas, props)

    props.canvas.renderAll()

    // fabric.Image.fromURL('../assets/pug.jpg', function(img) {
    //   var oImg = img.set({ left: 0, top: 0}).scale(0.25);
    //   canvas.add(oImg);
    // });
  }

  initCanvas = () => {
    const { index, text, dentalChartComponent, canvas } = this.props
    const { action = {} } = dentalChartComponent
    const { icon } = action

    // console.log(action)

    // console.log(canvas.hoverCursor)

    // const polygon12 = new fabric.Polygon( // outside top
    //   [
    //     { x: 0, y: baseHeight },

    //     { x: baseWidth * 1, y: 0 },

    //     { x: baseWidth * 3, y: 0 },
    //     { x: baseWidth * 4, y: baseHeight },
    //   ],
    //   {
    //     ...cfg,
    //     fill: 'brown',
    //     top: baseHeight * 5,
    //   },
    // )
    // polygon12.rotate(180)

    // canvas.add(polygon12)

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
    // canvas.setZoom(zoom)
    // this.canvas = canvas
    // this.props.container.add(this.canvas)
    // console.log(this.canvas, this.props.container)
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
      container,
      ...props
    } = this.props
    return <div />
  }
}

export default Tooth
