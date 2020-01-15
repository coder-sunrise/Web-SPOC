import React, { useState, useEffect } from 'react'
import { Paper } from '@material-ui/core'

import _ from 'lodash'
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
  notification,
} from '@/components'

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
    codetable,
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
  const tableProps = {
    size: 'sm',
    rows: values.rows.filter((d) => !!d),
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

    EditingProps: {
      showAddCommand: true,
      isDeletable: (row) => {
        return row.isUserMaintainable
      },
      onRowDelete: (r) => {
        const { cttreatment = [] } = codetable
        const canDelete = !cttreatment.find((o) => o.chartMethodFK === r.id)
        if (!canDelete)
          notification.error({
            message: 'This chart method has link with active treatment',
          })
        return canDelete
      },
      // showDeleteCommand: false,
      onCommitChanges: handleCommitChanges,
      onAddedRowsChange: (rows) => {
        return rows.map((o) => {
          return { value: getUniqueId(), isUserMaintainable: true, ...o }
        })
      },
    },
    onRowDrop: (rows) => {
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
  mapPropsToValues: ({ codetable }) => {
    return {
      rows: codetable.ctchartmethod,
    }
  },

  validationSchema: Yup.object().shape({
    rows: Yup.array().of(rowSchema),
  }),

  handleSubmit: (values, { props }) => {
    const { dispatch, codetable, onConfirm } = props
    const { ctchartmethod } = codetable

    let diffs = difference(
      values.rows.map(({ rowIndex, ...o }) => o),
      ctchartmethod,
    )
    if (diffs.length !== 0) {
      const updated = values.rows
        .map((o, i) => {
          if (o) {
            return {
              ...o,
              sortOrder: i,
            }
          }
        })
        .filter((o, i) => diffs[i] && Object.values(diffs[i]).length)
      dispatch({
        type: 'dentalChartSetup/post',
        payload: updated,
      }).then((o) => {
        // console.log(o)
        if (o) {
          notification.success({
            message: 'Setting updated',
          })
          if (onConfirm) onConfirm()
        }
      })
    }
  },

  displayName: 'DentalChartMethodSetup',
})(Setup)
