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

import Tooth from './Tooth'

import ButtonGroup from './ButtonGroup'

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

@connect(({ dentalChartComponent }) => ({
  dentalChartComponent,
}))
class DentalChart extends React.Component {
  constructor (props) {
    super(props)
    this._canvas = React.createRef()

    this.divContainer = React.createRef()

    this.configs = [
      {
        index: 18,
        text: text1,
      },
      // {
      //   index: 17,
      //   text: text1,
      // },
      // {
      //   index: 16,
      //   text: text1,
      // },
      // {
      //   index: 15,
      //   text: text1,
      // },
      // {
      //   index: 14,
      //   text: text2,
      // },
      // {
      //   index: 13,
      //   text: text2,
      // },
      // {
      //   index: 12,
      //   text: text2,
      // },
      // {
      //   index: 11,
      //   text: text2,
      // },
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

  componentDidMount () {}

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
      <div className={className} ref={this.divContainer}>
        <GridContainer>
          <GridItem md={8}>
            {/* <canvas id={this.id} ref={this._canvas}>
              Sorry, Canvas HTML5 element is not supported by your browser :(
            </canvas> */}
            {this.configs.map((o) => {
              console.log(data.filter((m) => m.toothIndex === o.index))
              return (
                <Tooth
                  {...o}
                  ca
                  values={data.filter((m) => m.toothIndex === o.index)}
                  {...this.props}
                />
              )
            })}
          </GridItem>
          <GridItem md={4}>test</GridItem>
        </GridContainer>

        <ButtonGroup {...this.props} />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(DentalChart)
