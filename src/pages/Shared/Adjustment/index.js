import React, { Component, PureComponent, useState } from 'react'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import { connect } from 'dva'
import { isNumber } from 'util'
import { withStyles, Divider, Paper } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { formatMessage } from 'umi/locale'
import Yup from '@/utils/yup'
import { calculateAdjustAmount } from '@/utils/utils'

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
  Snackbar,
} from '@/components'

const styles = (theme) => ({})
@connect(({ global }) => ({
  global,
}))
@withFormik({
  mapPropsToValues: ({ global }) => {
    const { defaultValues = {} } = global.openAdjustmentConfig || {}
    // const { openAdjustmentValue } = global
    // console.log(defaultValues)
    if (defaultValues) {
      defaultValues.isExactAmount = defaultValues.adjType !== 'Percentage'
      defaultValues.isMinus = !(defaultValues.adjValue > 0)
      defaultValues.finalAmount = calculateAdjustAmount(
        defaultValues.isExactAmount,
        defaultValues.initialAmout,
        defaultValues.adjValue,
      ).amount
      defaultValues.adjustment = Math.abs(defaultValues.adjValue || 0)
    }

    return {
      initialAmout: 0,
      isExactAmount: true,
      isMinus: true,
      ...defaultValues,
    }
  },
  validationSchema: ({ global }) => {
    const { openAdjustmentConfig } = global
    const extraCfg = {}
    if (openAdjustmentConfig.showRemark) {
      extraCfg.adjRemark = Yup.string().required()
    }
    return Yup.object().shape({
      // adjustment: Yup.number().required().min(
      //   0.01,
      //   formatMessage({
      //     id: 'inventory.pr.detail.pod.summary.adjustment.minAdjustment',
      //   }),
      // ),
      // finalAmount: Yup.number()
      //   .min(
      //     0,
      //     formatMessage({
      //       id:
      //         'inventory.pr.detail.pod.summary.adjustment.largerThanTotalAmount',
      //     }),
      //   )
      //   .required(),
      ...extraCfg,
      // remarks: Yup.string().required(),
    })
  },

  handleSubmit: (values, { props }) => {
    if (values.isMinus && values.adjustment > 0) {
      let minusValue = -values.adjustment
      values.adjustment = minusValue
    }
    const { dispatch, global } = props
    const { openAdjustmentConfig = {} } = global
    const { callbackConfig, callbackMethod } = openAdjustmentConfig
    const newVals = {
      ...values,
      adjValue: values.adjustment,
      adjAmount: values.finalAmount - values.initialAmout,
      adjType: values.isExactAmount ? 'ExactAmount' : 'Percentage',
    }
    // console.log(newVals)
    dispatch({
      type: 'global/updateState',
      payload: {
        openAdjustmentValue: newVals,
      },
    })
    // console.log(callbackConfig)
    if (callbackConfig) {
      const { model, reducer } = callbackConfig
      dispatch({
        type: `${model}/${reducer}`,
        payload: newVals,
      })
    }
    if (callbackMethod) {
      callbackMethod(newVals)
    }
    if (props.onConfirm) props.onConfirm()
  },
  displayName: 'GlobalAdjustment',
})
class Adjustment extends PureComponent {
  getFinalAmount = ({ value } = {}) => {
    const { values, setFieldValue } = this.props
    const { isExactAmount, isMinus, adjustment, initialAmout = 0 } = values

    setFieldValue(
      'finalAmount',
      calculateAdjustAmount(isExactAmount, initialAmout, value || adjustment)
        .amount,
    )
  }

  onConditionChange = (v) => {
    // console.log(this.props, 'onConditionChange')
    const { values, setFieldValue } = this.props
    const { isExactAmount, isMinus, adjustment } = values
    if (!isNumber(adjustment)) return
    let value = adjustment

    if (!isMinus) {
      value = Math.abs(adjustment)
    } else {
      value = -Math.abs(adjustment)
    }
    v = value

    this.getFinalAmount({ value })
  }

  render () {
    const { theme, footer, values, global, errors, ...props } = this.props
    const { openAdjustmentConfig = {} } = global
    const {
      showRemark,
      orginalAmount,
      isMinus,
      showAmountPreview = true,
    } = openAdjustmentConfig

    return (
      <div>
        <div style={{ margin: theme.spacing(1) }}>
          {errors &&
          errors.finalAmount && (
            <Snackbar variant='warning' message={errors.finalAmount} />
          )}
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
                  args.min = 0
                  if (values.isExactAmount) {
                    return (
                      <NumberInput
                        autoFocus
                        currency
                        label='Adjustment'
                        onChange={() => {
                          setTimeout(() => {
                            this.onConditionChange()
                          }, 1)
                        }}
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
                          this.onConditionChange()
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
                  name='adjRemark'
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
            {showAmountPreview && (
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
            )}
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
