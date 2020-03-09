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
  SizeContainer,
} from '@/components'

import Main from './Main'

class DentalChart extends React.Component {
  render () {
    return (
      <SizeContainer size='sm'>
        <Main />
      </SizeContainer>
    )
  }
}

export default DentalChart
