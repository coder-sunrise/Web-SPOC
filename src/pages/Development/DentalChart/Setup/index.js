import React, { useState, useEffect } from 'react'
import { withStyles, Divider, Paper } from '@material-ui/core'
import { Field, FastField } from 'formik'
import { connect } from 'dva'
import _ from 'lodash'
import DeleteIcon from '@material-ui/icons/Delete'
import AttachMoney from '@material-ui/icons/AttachMoney'
import History from '@material-ui/icons/History'
import moment from 'moment'
import Yup from '@/utils/yup'

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
  EditableTableGrid,
  withFormikExtend,
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
} from '../variables'

import Legend from './Legend'

const methods = [
  {
    value: 'surface',
    name: 'Surface',
  },
  {
    value: 'tooth',
    name: 'Tooth',
  },
  {
    value: 'bridging',
    name: 'Bridging',
  },
  {
    value: 'na',
    name: 'NA',
  },
]
const rowSchema = Yup.object().shape({
  text: Yup.string().required(),
  method: Yup.string().required(),
})

const Setup = (props) => {
  const {
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
    height,
    dentalChartSetup,
    values,
    setFieldValue,
    footer,
    ...restProps
  } = props
  const { data = {}, pedoChart, surfaceLabel } = dentalChartComponent
  // console.log(restProps, dentalChartSetup)
  // style={{ height: `${height}px` }}
  const [
    rows,
    setRows,
  ] = React.useState(false)

  const handleCommitChanges = ({ rows }) => {
    console.log(rows)
    setFieldValue('rows', rows)
  }
  // useState()
  return (
    <div>
      <Paper elevation={0}>
        <GridContainer style={{ height: 'auto' }}>
          <GridItem xs={12}>
            <EditableTableGrid
              size='sm'
              rows={values.rows}
              columns={[
                { name: 'code', title: 'Code' },
                { name: 'method', title: 'Method' },
                { name: 'legend', title: 'Legend' },
                {
                  name: 'text',
                  title: 'Name',
                },
                {
                  name: 'isDisplay',
                  title: 'Display in Diagnosis',
                },
              ]}
              columnExtensions={[
                {
                  width: 400,
                  columnName: 'legend',
                  isReactComponent: true,
                  type: 'custom',
                  render: Legend,
                },
                {
                  columnName: 'method',
                  type: 'select',
                  options: methods,
                },
                {
                  columnName: 'isDisplay',
                  type: 'checkbox',
                  align: 'center',
                },
              ]}
              FuncProps={{
                pager: false,
              }}
              EditingProps={{
                showAddCommand: true,
                isDeletable: (row) => {
                  return !row.fixed
                },
                // showDeleteCommand: false,
                onCommitChanges: handleCommitChanges,
                // onEditingRowIdsChange: this.handleEditingRowIdsChange,
              }}
              schema={rowSchema}
            />
          </GridItem>
        </GridContainer>
        {footer &&
          footer({
            align: 'center',
            onConfirm: props.handleSubmit,
            confirmBtnText: 'Save',
          })}
      </Paper>
    </div>
  )
}
export default withFormikExtend({
  mapPropsToValues: ({ dentalChartComponent }) => {
    return {
      rows: buttonConfigs,
    }
  },

  validationSchema: Yup.object().shape({
    rows: Yup.array().of(rowSchema),
  }),

  handleSubmit: (values, { props, resetForm }) => {
    console.log(values)
    const { dispatch, history, codetable } = props
  },

  displayName: 'DentalChartMethodSetup',
})(Setup)
