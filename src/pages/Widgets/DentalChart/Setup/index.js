import React, { useState, useEffect } from 'react'
import { Paper } from '@material-ui/core'
import Search from '@material-ui/icons/Search'
import Clear from '@material-ui/icons/Clear'
import _ from 'lodash'
import { compose } from 'redux'
import { connect } from 'dva'

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
  FastEditableTableGrid,
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
  // {
  //   value: 4,
  //   name: 'NA',
  // },
]
const rowSchema = Yup.object().shape({
  displayValue: Yup.string().required(),
  chartMethodTypeFK: Yup.number().required(),
})

const SetupBase = (props) => {
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

  const { mode } = dentalChartSetup
  const [
    search,
    setSearch,
  ] = React.useState('')
  const handleCommitChanges = ({ rows, changed, added = [] }) => {
    setFieldValue(
      'rows',
      added.concat(
        values.rows.map((o) => ({
          ...o,
          ...rows.find((m) => m.id === o.id),
        })),
      ),
    )
  }
  // useState()
  const columnExtensions = [
    {
      width: 400,
      columnName: 'legend',
      observeFields: [
        'chartMethodText',
        'chartMethodColorBlock',
        'image',
      ],
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
  // console.log(values.rows)
  const tableProps = {
    size: 'sm',
    rows: values.rows.filter(
      (d) =>
        !search ||
        (!!d &&
          !!d.displayValue &&
          d.displayValue.toUpperCase().indexOf(search.toUpperCase()) >= 0),
    ),
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
      showAddCommand: !search,
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
    FuncProps: {
      pager: true,
      pagerDefaultState: {
        pagesize: 50,
      },
    },
    onRowDoubleClick: () => {
      dispatch({
        type: 'dentalChartSetup/updateState',
        payload: {
          mode: 'edit',
        },
      })
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
          <GridItem xs={3}>
            <Switch
              value={mode}
              onOffMode={false}
              checkedChildren='Edit'
              checkedValue='edit'
              unCheckedChildren='Sort'
              unCheckedValue='sort'
              onChange={(v) => {
                dispatch({
                  type: 'dentalChartSetup/updateState',
                  payload: {
                    mode: v,
                  },
                })
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <TextField
              value={search}
              prefix={<Search />}
              suffix={search && <Clear onClick={() => setSearch('')} />}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
            />
          </GridItem>

          <GridItem xs={12} style={{ height: height - 112, overflow: 'auto' }}>
            {/* <DragableTableGrid {...tableProps} /> */}

            {mode === 'edit' ? (
              <FastEditableTableGrid {...tableProps} />
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
            extraButtons: (
              <Button
                color='primary'
                style={{ float: 'left' }}
                onClick={() => {
                  dispatch({
                    type: 'dentalChartSetup/updateState',
                    payload: {
                      mode: mode === 'edit' ? 'sort' : 'edit',
                    },
                  })
                }}
              >
                {mode === 'edit' ? 'Edit Mode' : 'Sort Mode'}
              </Button>
            ),
          })}
      </Paper>
    </div>
  )
}

const Setup = compose(
  connect(({ dentalChartSetup }) => ({
    dentalChartSetup,
  })),
  withFormikExtend({
    mapPropsToValues: ({ codetable }) => {
      return {
        rows: codetable.ctchartmethod,
      }
    },

    validationSchema: Yup.object().shape({
      rows: Yup.array().compact((v) => v.isDeleted).of(rowSchema),
    }),

    handleSubmit: (values, { props }) => {
      const { dispatch, codetable, onConfirm } = props
      const { ctchartmethod } = codetable

      let diffs = difference(
        values.rows
          .filter((o) => !o.isDeleted || !o.isNew)
          .map(({ rowIndex, ...o }) => o),
        ctchartmethod,
      )
      if (diffs.length !== 0) {
        const updated = values.rows
          .filter((o) => !o.isDeleted || !o.isNew)
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
          if (o) {
            notification.success({
              message: 'Setting updated',
            })
            dispatch({
              type: 'dentalChartComponent/updateState',
              payload: {
                action: undefined,
              },
            })
            if (onConfirm) onConfirm()
          }
        })
      } else if (onConfirm) onConfirm()
    },

    displayName: 'DentalChartMethodSetup',
  }),
)(SetupBase)

// export default React.memo(Setup, (props, propsNext) => {
//   console.log(difference(props, propsNext))
//   return _.isEqual(props, propsNext)
// })

export default Setup
