import React, { PureComponent } from 'react'
import { withFormik, Field, FastField } from 'formik'
import { connect } from 'dva'
import { isNumber } from 'util'
import { withStyles } from '@material-ui/core'
import Yup from '@/utils/yup'
import { calculateAdjustAmount, calculateAmount } from '@/utils/utils'
import { Alert } from 'antd'

import {
  Danger,
  GridContainer,
  GridItem,
  TextField,
  Switch,
  NumberInput,
  Snackbar,
} from '@/components'

const styles = theme => ({
  mainInput: {
    width: 'calc(100% - 120px)',
    display: 'inline-block',
    marginRight: theme.spacing(),
  },
})
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
    const { callbackConfig, callbackMethod, editAdj } = openAdjustmentConfig
    const newVals = {
      ...values,
      adjValue: values.adjustment,
      adjAmount: values.finalAmount - values.initialAmout,
      adjType: values.isExactAmount ? 'ExactAmount' : 'Percentage',
      invoiceItemAdjustment: [],
      id: editAdj ? editAdj.id : undefined,
      concurrencyToken: editAdj ? editAdj.concurrencyToken : undefined,
    }
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
  state = {
    showError: false,
  }

  getFinalAmount = ({ value } = {}) => {
    const { values, setFieldValue, global } = this.props
    const { isExactAmount, initialAmout = 0 } = values
    const { rows = [], adjustments = [], editAdj, config = {} } =
      global.openAdjustmentConfig || {}
    const finalAmount = calculateAdjustAmount(
      isExactAmount,
      initialAmout,
      value,
    ).amount

    const result = calculateAmount(
      rows,
      editAdj
        ? adjustments.map(o => {
            if (
              (editAdj.uid && editAdj.uid === o.uid) ||
              (!editAdj.uid && editAdj.index === o.index)
            )
              return {
                ...o,
                adjType: isExactAmount ? 'ExactAmount' : 'Percentage',
                adjValue: value,
              }
            return o
          })
        : [
            ...adjustments,
            {
              adjType: isExactAmount ? 'ExactAmount' : 'Percentage',
              adjValue: value,
            },
          ],
      config,
    )

    if (result.summary.totalAfterAdj < 0) {
      this.showError()
    } else {
      this.hideError()
    }
    setFieldValue('finalAmount', finalAmount)
  }

  hideError = () => {
    this.setState({
      showError: false,
    })
  }

  showError = () => {
    this.setState({
      showError: true,
    })
  }

  onConditionChange = v => {
    // console.log(this.props, 'onConditionChange')
    const { values, setFieldValue } = this.props
    const { isExactAmount, isMinus, adjustment } = values
    if (!isNumber(adjustment)) {
      this.props.setFieldValue('adjValue', 0)
    }
    let value = adjustment || 0

    if (!isMinus) {
      value = Math.abs(adjustment)
    } else {
      value = -Math.abs(adjustment)
    }
    v = value

    this.getFinalAmount({ value })
  }

  render() {
    const {
      theme,
      footer,
      values,
      global,
      errors,
      classes,
      ...props
    } = this.props
    const { openAdjustmentConfig = {} } = global
    const {
      showRemark,
      orginalAmount,
      isMinus,
      showAmountPreview = true,
    } = openAdjustmentConfig
    const { showError } = this.state

    //console.log(openAdjustmentConfig)
    return (
      <div>
        <div style={{ margin: theme.spacing(1) }}>
          {errors && errors.finalAmount && (
            <Snackbar variant='warning' message={errors.finalAmount} />
          )}
          <GridContainer>
            <GridItem xs={12}>
              <FastField
                name='isMinus'
                render={args => {
                  return (
                    <Switch
                      style={{
                        width: 50,
                        display: 'inline-block',
                        marginTop: theme.spacing(2.5),
                      }}
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
              <Field
                name='adjustment'
                render={args => {
                  args.min = 0
                  if (values.isExactAmount) {
                    return (
                      <NumberInput
                        formControlProps={{
                          className: classes.mainInput,
                        }}
                        autoFocus
                        currency
                        label='Adjustment'
                        noSuffix
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
                      formControlProps={{
                        className: classes.mainInput,
                      }}
                      noSuffix
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
              <FastField
                name='isExactAmount'
                render={args => {
                  return (
                    <Switch
                      style={{
                        width: 50,
                        display: 'inline-block',
                        marginTop: theme.spacing(2.5),
                      }}
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
            <GridItem md={1} />
            <GridItem md={11}>
              {showError && (
                <Alert
                  style={{ padding: '5px 15px 5px 37px' }}
                  message='Adding this adjustment will make the total bill negative.'
                  banner
                />
              )}
            </GridItem>
            {showRemark && (
              <GridItem xs={12}>
                <FastField
                  name='adjRemark'
                  render={args => {
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
                  render={args => {
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
              // disabled: showError,
            },
          })}
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(Adjustment)
