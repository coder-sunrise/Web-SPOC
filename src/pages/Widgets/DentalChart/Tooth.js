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
  fontColor,
  innerFontSize,
  sharedCfg,
  fontCfg,
  groupCfg,
  cellPrefix,
  createToothShape,
} from './variables'

const { fabric } = require('fabric')

class Tooth extends React.PureComponent {
  constructor (props) {
    super(props)

    this._canvasContainer = React.createRef()

    this.divContainer = React.createRef()

    this.id = getUniqueId()
  }

  componentDidMount () {
    const { zoom, width, height, ...restProps } = this.props
    this.canvas = new fabric.Canvas(this._canvasContainer.current, {
      width,
      height,
    })
    this.canvas.hoverCursor = 'default'
    if (zoom) this.canvas.setZoom(zoom)
    this.group = createToothShape({
      ...restProps,
      canvas: this.canvas,
    })
    if (this.group) this.canvas.add(this.group)
  }

  componentWillReceiveProps (nextProps) {
    if (!_.isEqual(nextProps, this.props)) {
      if (this.group) this.canvas.remove(this.group)
      const { zoom, width, height, ...restProps } = nextProps
      this.group = createToothShape({
        ...restProps,
        canvas: this.canvas,
      })
      if (this.group) this.canvas.add(this.group)

      this.canvas.renderAll()
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
      mode,
      onDataSouceChange,
      container,
      ...props
    } = this.props
    return (
      <div ref={this.divContainer} className={className}>
        <canvas id={this.id} ref={this._canvasContainer} />
      </div>
    )
  }
}

export default Tooth
