import React, { useState, useEffect } from 'react'
import { withStyles, Divider, Paper } from '@material-ui/core'
import { Field, FastField } from 'formik'
import { connect } from 'dva'
import { compose } from 'redux'
import _ from 'lodash'
import DeleteIcon from '@material-ui/icons/Delete'
import AttachMoney from '@material-ui/icons/AttachMoney'
import moment from 'moment'
import Yup from '@/utils/yup'
import {
  dateFormatLong,
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
import { findGetParameter } from '@/utils/utils'
import Chart from '../Chart'

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
    patientHistory,
    values,
    setFieldValue,
    footer,
    onConfirm,
    ...restProps
  } = props
  // console.log(props)

  const [
    selected,
    setSelected,
  ] = useState()

  const [
    current,
    setCurrent,
  ] = useState()

  useEffect(() => {
    // console.log(123)
    dispatch({
      type: 'patientHistory/initState',
      payload: {
        queueID: Number(findGetParameter('qid')) || 0,
        version: Number(findGetParameter('v')) || undefined,
        visitID: findGetParameter('visit'),
        patientID: Number(findGetParameter('pid')) || 0,
      },
    })
  }, [])
  useEffect(
    () => {
      if (dentalChartComponent.data && !current)
        setCurrent(_.clone(dentalChartComponent))
    },
    [
      dentalChartComponent,
    ],
  )

  const { list = [] } = patientHistory
  if (!current) return null
  return (
    <div>
      <SizeContainer size='sm'>
        <Paper elevation={0}>
          <GridContainer
            style={{
              height: 'auto',
              maxHeight: height - 73 - 63,
              overflow: 'auto',
            }}
          >
            <GridItem xs={12} style={{ marginBottom: theme.spacing(2) }}>
              <p>Current Chart</p>
              <Chart
                // style={{ padding: theme.spacing(0, 3), margin: '0 auto' }}
                dentalChartComponent={current}
                // dentalChartSetup={dentalChartSetup}
                readOnly
              />
            </GridItem>

            <GridItem xs={12} style={{ marginBottom: theme.spacing(1) }}>
              <GridContainer style={{ height: 'auto' }}>
                <GridItem xs={12}>Previous Chart</GridItem>
                <GridItem xs={6}>
                  <Select
                    label='Previous Visit Date'
                    dropdownMatchSelectWidth={false}
                    // value={selected}
                    options={list.map(
                      ({
                        id,
                        visitPurposeName,
                        visitDate,
                        userName = '',
                        userTitle = '',
                      }) => ({
                        value: id,
                        name: `${visitPurposeName} (${moment(visitDate).format(
                          dateFormatLong,
                        )}) ${userTitle} ${userName}`,
                      }),
                    )}
                    onChange={(v, op) => {
                      const item = list.find((o) => o.id === v)
                      if (item && item.coHistory[0]) {
                        dispatch({
                          type: 'patientHistory/queryOne',
                          payload: item.coHistory[0].id,
                        }).then(({ dentalChart = [] }) => {
                          if (dentalChart[0] && dentalChart[0].dentalChart) {
                            const d = {
                              data: JSON.parse(dentalChart[0].dentalChart),
                              isPedoChart: dentalChart[0].isPedoChart,
                              isSurfaceLabel: dentalChart[0].isSurfaceLabel,
                            }

                            setSelected(d)
                          } else {
                            setSelected(undefined)
                          }
                        })
                      } else {
                        setSelected(undefined)
                      }
                    }}
                  />
                </GridItem>
                <GridItem xs={6} style={{ lineHeight: theme.props.rowHeight }}>
                  <Button
                    color='primary'
                    disabled={!selected}
                    onClick={() => {
                      setCurrent(_.clone(selected))
                    }}
                  >
                    Copy
                  </Button>
                </GridItem>
              </GridContainer>
              {selected && (
                <Chart
                  // style={{ width: '70%', margin: '0 auto' }}
                  dentalChartComponent={selected}
                  readOnly
                />
              )}
            </GridItem>
          </GridContainer>
          {footer &&
            footer({
              align: 'center',
              onConfirm: () => {
                dispatch({
                  type: 'dentalChartComponent/updateState',
                  payload: {
                    data: selected.data,
                  },
                })
                if (onConfirm) onConfirm()
              },
              confirmBtnText: 'Save',
            })}
        </Paper>
      </SizeContainer>
    </div>
  )
}
export default compose(
  // withFormikExtend({
  //   mapPropsToValues: ({ dentalChartSetup }) => {
  //     return {}
  //   },

  //   validationSchema: Yup.object().shape({
  //     rows: Yup.array().of(rowSchema),
  //   }),

  //   handleSubmit: (values, { props, resetForm }) => {
  //     // console.log(values)
  //     const { dispatch, history, codetable, onConfirm } = props
  //     dispatch({
  //       type: 'dentalChartSetup/updateState',
  //       payload: {
  //         rows: values.rows,
  //       },
  //     })
  //     // localStorage.setItem('dentalChartSetup', JSON.stringify(values.rows))
  //     if (onConfirm) onConfirm()
  //   },

  //   displayName: 'DentalChartHistory',
  // }),
  connect(({ patientHistory }) => ({
    patientHistory,
  })),
)(History)
