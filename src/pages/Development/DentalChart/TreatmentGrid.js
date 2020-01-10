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
    dentalChartTreatment,
    codetable,
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
  const editRow = (row) => {
    const { ctchartmethod = [] } = codetable
    const { cttreatment = [] } = codetable

    dispatch({
      type: 'dentalChartTreatment/updateState',
      payload: {
        entity: row,
      },
    })
    const treatment = cttreatment.find((o) => o.id === row.treatmentFK) || {}
    console.log(treatment)
    const action = ctchartmethod.find((o) => o.id === treatment.chartMethodFK)

    console.log(action)
    dispatch({
      type: 'dentalChartComponent/updateState',
      payload: {
        action,
      },
    })
  }
  const columnExtensions = [
    {
      columnName: 'treatmentFK',
      type: 'codeSelect',
      code: 'cttreatment',
      labelField: 'displayValue',
    },
    {
      columnName: 'quantity',
      type: 'number',
    },
    {
      columnName: 'unitPrice',
      type: 'currency',
    },
    {
      columnName: 'totalAfterItemAdjustment',
      type: 'currency',
    },
    {
      columnName: 'adjAmount',
      type: 'currency',
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
                  editRow(row)
                }}
                justIcon
                color='primary'
              >
                <Edit />
              </Button>
            </Tooltip>
            <Popconfirm
              onConfirm={() => {
                dispatch({
                  type: 'dentalChartTreatment/deleteRow',
                  payload: {
                    id: row.id,
                  },
                })
                dispatch({
                  type: 'dentalChartComponent/deleteTreatment',
                  payload: {
                    id: row.treatmentFK,
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
    rows: dentalChartTreatment.rows.filter((o) => !o.isDeleted),
    columns: [
      // { name: 'code', title: 'Code' },
      { name: 'treatmentFK', title: 'Treatment' },

      { name: 'toothInfo', title: 'Tooth' },

      { name: 'itemsNotes', title: 'Details' },
      { name: 'quantity', title: 'Unit' },
      { name: 'unitPrice', title: 'Unit Price' },
      { name: 'adjAmount', title: 'Discount' },
      { name: 'totalAfterItemAdjustment', title: 'Sub Total' },
      { name: 'actions', title: 'Actions' },
    ],
    columnExtensions,
    onRowDoubleClick: editRow,

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
      onAddedRowsChange: (list) => {
        return list.map((o) => {
          return { value: getUniqueId(), ...o }
        })
      },
      // onEditingRowIdsChange: this.handleEditingRowIdsChange,
    },
    onRowDrop: (list) => {
      // console.log(rows)
      setFieldValue('rows', list)
    },
  }
  return (
    <div>
      <CommonTableGrid {...tableProps} />
    </div>
  )
}
export default TreatmentGrid
