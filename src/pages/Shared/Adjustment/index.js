import React, { Component, PureComponent, useState } from 'react'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import { connect } from 'dva'
import { withStyles, Divider, Paper } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import Yup from '@/utils/yup'

import {
  Button,
  CommonHeader,
  CommonModal,
  NavPills,
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  TextField,
  notification,
  Select,
  CodeSelect,
  DatePicker,
  RadioGroup,
  ProgressButton,
  CardContainer,
  confirm,
  Checkbox,
  Popover,
  Switch,
  NumberInput,
} from '@/components'

const styles = (theme) => ({})
@connect(({ global }) => ({
  global,
}))
@withFormik({
  mapPropsToValues: ({ global }) => {
    const { defaultValues } = global.openAdjustmentConfig || {}
    return {
      initialAmout: 0,
      isExactAmount: true,
      isMinus: true,
      finalAmount: defaultValues.initialAmout,
      ...defaultValues,
    }
  },
  validationSchema: Yup.object().shape({
    adjustment: Yup.number().required(),
    finalAmount: Yup.number()
      .min(0.01, 'Adjustment is larger than total amount. Please amend')
      .required(),
    // remarks: Yup.string().required(),
  }),

  handleSubmit: (values, { props }) => {
    const { dispatch, global } = props
    const { openAdjustmentConfig = {} } = global
    const { callbackConfig } = openAdjustmentConfig
    dispatch({
      type: 'global/updateState',
      payload: {
        openAdjustmentValue: values,
      },
    })
    // console.log(callbackConfig)
    if (callbackConfig) {
      const { model, reducer } = callbackConfig
      dispatch({
        type: `${model}/${reducer}`,
        payload: values,
      })
    }
    if (props.onConfirm) props.onConfirm()
  },
  displayName: 'GlobalAdjustment',
})
class Adjustment extends PureComponent {
  getFinalAmount = ({ value } = {}) => {
    console.log('getFinalAmount')
    const { values, setFieldValue } = this.props
    const { isExactAmount, isMinus, adjustment, initialAmout = 0 } = values
    let amount = initialAmout
    if (isExactAmount) {
      amount += value || adjustment
    } else {
      amount += initialAmout * (value || adjustment) * 0.01
    }

    setFieldValue('finalAmount', amount)
  }

  onConditionChange = (v) => {
    const { values, setFieldValue } = this.props
    const { isExactAmount, isMinus, adjustment } = values
    let value = adjustment
    if (isMinus) {
      value = -Math.abs(adjustment)
    } else {
      value = Math.abs(adjustment)
    }
    setFieldValue('adjustment', value)

    this.getFinalAmount({ value })
  }

  // onOperatorChange = (v) => {
  //   const { values, setFieldValue } = this.props
  //   const { isExactAmount, isMinus, adjustment } = values
  //   let value = adjustment
  //   if (v) {
  //     value = -Math.abs(adjustment)
  //   } else {
  //     value = Math.abs(adjustment)
  //   }
  //   this.getFinalAmount({ value })
  // }

  render () {
    const { theme, footer, values, global, ...props } = this.props
    // console.log(values)
    const { openAdjustmentConfig = {} } = global
    const { showRemark, orginalAmount, isMinus } = openAdjustmentConfig
    // console.log(global, openAdjustmentConfig)
    return (
      <div>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem xs={1}>
              <FastField
                name='isMinus'
                render={(args) => {
                  return (
                    <Switch
                      checkedChildren='-'
                      unCheckedChildren='+'
                      label=''
                      onChange={() => {
                        setTimeout(() => {
                          this.onConditionChange()
                        }, 1)
                      }}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={9} style={{ paddingLeft: theme.spacing(2) }}>
              <Field
                name='adjustment'
                render={(args) => {
                  if (values.isExactAmount) {
                    return (
                      <NumberInput
                        autoFocus
                        currency
                        label='Adjustment'
                        onChange={this.onConditionChange}
                        {...args}
                      />
                    )
                  }
                  return (
                    <NumberInput
                      percentage
                      autoFocus
                      max={999}
                      label='Adjustment'
                      onChange={this.onConditionChange}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={2}>
              <FastField
                name='isExactAmount'
                render={(args) => {
                  return (
                    <Switch
                      checkedChildren='$'
                      unCheckedChildren='%'
                      label=''
                      onChange={() => {
                        setTimeout(() => {
                          this.getFinalAmount()
                        }, 1)
                      }}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            {showRemark && (
              <GridItem xs={12}>
                <FastField
                  name='remarks'
                  render={(args) => {
                    return (
                      <TextField
                        label='Remarks'
                        multiline
                        rowsMax='2'
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            )}
            <GridItem xs={12}>
              <FastField
                name='finalAmount'
                render={(args) => {
                  return (
                    <NumberInput
                      style={{ marginTop: theme.spacing(2) }}
                      currency
                      prefix='Total Amount After Adjustment:'
                      text
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmProps: {
              disabled: false,
            },
          })}
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(Adjustment)
