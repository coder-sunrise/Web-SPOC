import React, { useState, useEffect } from 'react'
import { withStyles, Divider, Paper } from '@material-ui/core'
import { Field, FastField } from 'formik'
import _ from 'lodash'
import DeleteIcon from '@material-ui/icons/Delete'
import AttachMoney from '@material-ui/icons/AttachMoney'
import History from '@material-ui/icons/History'
import moment from 'moment'
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
  Tabs,
  OutlinedTextField,
  ProgressButton,
} from '@/components'

const Diagnosis = ({
  dispatch,
  theme,
  index,
  arrayHelpers,
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
}) => {
  const { data = {}, pedoChart, surfaceLabel } = dentalChartComponent

  return (
    <div>
      <h4>Tooth Journal</h4>

      <OutlinedTextField
        label='Remarks'
        multiline
        maxLength={2000}
        rowsMax={3}
        rows={3}
      />
      <p style={{ textAlign: 'right' }}>
        <ProgressButton style={{ marginRight: 0 }}>Save</ProgressButton>
      </p>
    </div>
  )
}

export default Diagnosis
