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
  CommonTableGrid,
  DragableTableGrid,
  withFormikExtend,
  Switch,
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
  // console.log(props)
  // style={{ height: `${height}px` }}
  const [
    selectedRows,
    setSelectedRows,
  ] = React.useState([])
  const [
    mode,
    setMode,
  ] = useState('color')
  const handleCommitChanges = ({ rows, changed }) => {
    // console.log(rows, changed)
    setFieldValue('rows', rows)
  }
  // useState()
  const columnExtensions = [
    {
      width: 400,
      columnName: 'legend',
      isReactComponent: true,
      type: 'custom',
      render: (p) => {
        return <Legend {...p} viewOnly={mode !== 'edit'} />
      },
    },
    {
      columnName: 'method',
      type: 'select',
      options: methods,
      isDisabled: (row) => {
        return row.fixed
      },
    },
    {
      columnName: 'isDiagnosis',
      type: 'checkbox',
      align: 'center',
      isDisabled: (row) => {
        return row.fixed
      },
    },
    {
      columnName: 'text',
      isDisabled: (row) => {
        return row.fixed
      },
    },
  ]
  // if(mode==='sort'){
  //   columnExtensions.
  // }
  const tableProps = {
    size: 'sm',
    rows: values.rows,
    dataSource: values.rows,
    rowDragable: true,
    columns: [
      { name: 'code', title: 'Code' },
      { name: 'method', title: 'Method' },
      { name: 'legend', title: 'Legend' },

      {
        name: 'text',
        title: 'Name',
      },
      {
        name: 'isDiagnosis',
        title: 'Display in Diagnosis',
      },
    ],
    columnExtensions,

    FuncProps: {
      pager: false,

      // selectable: true,
      // selectConfig: {
      //   showSelectAll: true,
      //   rowSelectionEnabled: () => true,
      // },
    },
    // selection: selectedRows,
    // onSelectionChange: (rows) => {
    //   console.log(rows)
    //   setSelectedRows(rows)
    // },
    EditingProps: {
      showAddCommand: true,
      isDeletable: (row) => {
        return !row.fixed
      },
      // showDeleteCommand: false,
      onCommitChanges: handleCommitChanges,
      // onEditingRowIdsChange: this.handleEditingRowIdsChange,
    },
    onRowDrop: (rows) => {
      console.log(rows)
      setFieldValue('rows', rows)
    },
    schema: rowSchema,
  }
  return (
    <div>
      <Paper elevation={0}>
        <GridContainer style={{ height: 'auto' }}>
          <GridItem xs={12}>
            <Switch
              value={mode}
              onOffMode={false}
              checkedChildren='Edit'
              checkedValue='edit'
              unCheckedChildren='Sort'
              unCheckedValue='sort'
              onChange={(v) => {
                setMode(v)
              }}
            />
          </GridItem>
          <GridItem xs={12}>
            {/* <DragableTableGrid {...tableProps} /> */}

            {mode === 'edit' ? (
              <EditableTableGrid {...tableProps} />
            ) : (
              <CommonTableGrid {...tableProps} />
            )}
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
  mapPropsToValues: ({ dentalChartSetup }) => {
    return {
      rows: dentalChartSetup.rows || buttonConfigs,
    }
  },

  validationSchema: Yup.object().shape({
    rows: Yup.array().of(rowSchema),
  }),

  handleSubmit: (values, { props, resetForm }) => {
    console.log(values)
    const { dispatch, history, codetable, onConfirm } = props
    dispatch({
      type: 'dentalChartSetup/updateState',
      payload: {
        rows: values.rows,
      },
    })
    localStorage.setItem('dentalChartSetup', JSON.stringify(values.rows))
    if (onConfirm) onConfirm()
  },

  displayName: 'DentalChartMethodSetup',
})(Setup)
