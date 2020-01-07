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
import { getUniqueId, difference } from '@/utils/utils'

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
    value: 1,
    name: 'Surface',
  },
  {
    value: 2,
    name: 'Tooth',
  },
  {
    value: 3,
    name: 'Bridging',
  },
  {
    value: 4,
    name: 'NA',
  },
]
const rowSchema = Yup.object().shape({
  displayValue: Yup.string().required(),
  chartMethodTypeFK: Yup.number().required(),
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
    setValues,
    footer,
    ...restProps
  } = props
  const [
    mode,
    setMode,
  ] = useState('sort')
  // useEffect(() => {
  //   if (!values.rows || values.rows.Legend === 0)
  //     dispatch({
  //       type: 'dentalChartSetup/query',
  //     }).then((response) => {
  //       if (response.data)
  //         setValues({
  //           rows: response.data,
  //         })
  //       // console.log(list)
  //     })
  //   // console.log('did h')
  // }, [])
  const handleCommitChanges = ({ rows, changed }) => {
    console.log(rows, changed)
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
      columnName: 'chartMethodTypeFK',
      type: 'select',
      options: methods,
      isDisabled: (row) => {
        return !row.isUserMaintainable
      },
    },
    {
      columnName: 'isDisplayInDiagnosis',
      type: 'checkbox',
      align: 'center',
      isDisabled: (row) => {
        return (
          !row.isUserMaintainable ||
          mode === 'sort' ||
          row.chartMethodTypeFK === 3
        )
      },
    },
    {
      columnName: 'code',
      isDisabled: (row) => {
        return !row.isUserMaintainable
      },
    },
    {
      columnName: 'displayValue',
      isDisabled: (row) => {
        return !row.isUserMaintainable
      },
    },
  ]
  // if(mode==='sort'){
  //   columnExtensions.
  // }
  const tableProps = {
    size: 'sm',
    rows: values.rows,
    // dataSource: values.rows,
    // type: 'dentalChartSetup',
    // entity: dentalChartSetup,
    rowDragable: true,
    columns: [
      { name: 'code', title: 'Code' },
      { name: 'chartMethodTypeFK', title: 'Method' },
      { name: 'legend', title: 'Legend' },

      {
        name: 'displayValue',
        title: 'Name',
      },
      {
        name: 'isDisplayInDiagnosis',
        title: 'Display in Diagnosis',
      },
    ],
    columnExtensions,

    FuncProps: {
      // pager: false,
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
        return row.isUserMaintainable
      },
      // showDeleteCommand: false,
      onCommitChanges: handleCommitChanges,
      onAddedRowsChange: (rows) => {
        return rows.map((o) => {
          return { value: getUniqueId(), isUserMaintainable: true, ...o }
        })
      },
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
      rows:
        JSON.parse(localStorage.getItem('dentalChartSetup')) ||
        dentalChartSetup.list, // || buttonConfigs,
    }
  },

  validationSchema: Yup.object().shape({
    rows: Yup.array().of(rowSchema),
  }),

  handleSubmit: (values, { props, resetForm }) => {
    // console.log(values)
    const { dispatch, history, codetable, onConfirm, dentalChartSetup } = props
    const { list } = dentalChartSetup
    dispatch({
      type: 'dentalChartSetup/updateState',
      payload: {
        rows: values.rows,
      },
    })
    console.log(list, values.rows, difference(list, values.rows))
    // const items =values.rows.filter(o=>!list.find(m=>m.id===o.id)).concat(values.rows.filter())

    localStorage.setItem('dentalChartSetup', JSON.stringify(values.rows))
    if (onConfirm) onConfirm()
  },

  displayName: 'DentalChartMethodSetup',
})(Setup)
