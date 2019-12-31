import React, { useState, useEffect } from 'react'
import { withStyles, Divider, Paper } from '@material-ui/core'
import { Field, FastField } from 'formik'
import { connect } from 'dva'
import _ from 'lodash'
import DeleteIcon from '@material-ui/icons/Delete'
import AttachMoney from '@material-ui/icons/AttachMoney'
import moment from 'moment'
import Yup from '@/utils/yup'
import { getUniqueId } from '@/utils/utils'
import Chart from '../Chart'
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
  SizeContainer,
} from '@/components'

const rowSchema = Yup.object().shape({
  text: Yup.string().required(),
  method: Yup.string().required(),
})

const History = (props) => {
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
  console.log(props)
  return (
    <div>
      <SizeContainer size='sm'>
        <Paper elevation={0}>
          <GridContainer
            style={{ height: 'auto', maxHeight: height - 73, overflow: 'auto' }}
          >
            <GridItem xs={8} style={{ marginBottom: theme.spacing(2) }}>
              <p>Current Chart</p>
              <Chart
                // style={{ padding: theme.spacing(0, 3), margin: '0 auto' }}
                dentalChartComponent={dentalChartComponent}
                dentalChartSetup={dentalChartSetup}
                readOnly
              />
            </GridItem>

            <GridItem xs={8} style={{ marginBottom: theme.spacing(1) }}>
              <GridContainer style={{ height: 'auto' }}>
                <GridItem xs={12}>Previous Chart</GridItem>
                <GridItem xs={6} md={3}>
                  <Select label='Previous Visit Date' />
                </GridItem>
                <GridItem
                  xs={6}
                  md={3}
                  style={{ lineHeight: theme.props.rowHeight }}
                >
                  <Button color='primary'>Copy</Button>
                </GridItem>
              </GridContainer>
              <Chart
                // style={{ width: '70%', margin: '0 auto' }}
                dentalChartComponent={{ ...dentalChartComponent, data: [] }}
                dentalChartSetup={dentalChartSetup}
                readOnly
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
      </SizeContainer>
    </div>
  )
}
export default withFormikExtend({
  mapPropsToValues: ({ dentalChartSetup }) => {
    return {}
  },

  validationSchema: Yup.object().shape({
    rows: Yup.array().of(rowSchema),
  }),

  handleSubmit: (values, { props, resetForm }) => {
    // console.log(values)
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

  displayName: 'DentalChartHistory',
})(History)
