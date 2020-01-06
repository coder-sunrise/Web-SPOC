import React, { useState, useEffect } from 'react'
import { withStyles, Divider, Paper } from '@material-ui/core'
import { Field, FastField } from 'formik'
import { connect } from 'dva'
import _ from 'lodash'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import History from '@material-ui/icons/History'
import moment from 'moment'
import Yup from '@/utils/yup'
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
  Tabs,
  EditableTableGrid,
  CommonTableGrid,
  DragableTableGrid,
  withFormikExtend,
  Switch,
  Popconfirm,
} from '@/components'

const TreatmentGrid = (props) => {
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
  const [
    mode,
    setMode,
  ] = useState('sort')
  const handleCommitChanges = ({ rows, changed }) => {
    // console.log(rows, changed)
    setFieldValue('rows', rows)
  }
  // useState()
  const columnExtensions = [
    {
      columnName: 'isDiagnosis',
      type: 'checkbox',
      align: 'center',
      isDisabled: (row) => {
        return row.fixed || mode === 'sort'
      },
    },
    {
      columnName: 'text',
      isDisabled: (row) => {
        return row.fixed
      },
    },
    {
      columnName: 'actions',
      width: 70,
      align: 'center',
      sortingEnabled: false,
      render: (row) => {
        return (
          <div>
            <Tooltip title='Edit'>
              <Button
                size='sm'
                onClick={() => {
                  // editRow(row)
                }}
                justIcon
                color='primary'
                style={{ marginRight: 5 }}
              >
                <Edit />
              </Button>
            </Tooltip>
            <Popconfirm
              onConfirm={() => {
                dispatch({
                  type: 'orders/deleteRow',
                  payload: {
                    uid: row.uid,
                  },
                })
              }}
            >
              <Tooltip title='Delete'>
                <Button size='sm' color='danger' justIcon>
                  <Delete />
                </Button>
              </Tooltip>
            </Popconfirm>
          </div>
        )
      },
    },
  ]
  // if(mode==='sort'){
  //   columnExtensions.
  // }
  const tableProps = {
    size: 'sm',
    rows: [
      {
        treatment: '123',
      },
    ],
    columns: [
      // { name: 'code', title: 'Code' },
      { name: 'treatment', title: 'Treatment' },
      { name: 'tooth', title: 'Tooth' },
      { name: 'details', title: 'Details' },
      { name: 'unit', title: 'Unit' },
      { name: 'unitPrice', title: 'Unit Price' },
      { name: 'discount', title: 'Discount' },
      { name: 'subTotal', title: 'Sub Total' },
      { name: 'actions', title: 'Actions' },
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
      onAddedRowsChange: (rows) => {
        return rows.map((o) => {
          return { value: getUniqueId(), ...o }
        })
      },
      // onEditingRowIdsChange: this.handleEditingRowIdsChange,
    },
    onRowDrop: (rows) => {
      // console.log(rows)
      setFieldValue('rows', rows)
    },
  }
  return (
    <div>
      <CommonTableGrid {...tableProps} />
    </div>
  )
}
export default TreatmentGrid
