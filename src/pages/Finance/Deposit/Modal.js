import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Field, withFormik } from 'formik'
import moment from 'moment'
import * as Yup from 'yup'
import { formatMessage } from 'umi/locale'
import { withStyles, Grid, Divider } from '@material-ui/core'
import { paymentMethods } from '@/utils/codes'

import {
  GridContainer,
  GridItem,
  NumberInput,
  TextField,
  DatePicker,
  Select,
  notification,
} from '@/components'

const style = () => ({
  totalPayment: {
    textAlign: 'right',
  },
  summaryLabel: {
    paddingTop: 0,
  },
})

@connect(({ deposit }) => ({
  deposit,
}))
@withFormik({
  mapPropsToValues: () => ({
    Date: moment(),
    Mode: '',
    Remark: '',
    Balance: 100,
    ODBalance: 0,
    Amount: 0,
  }),
  validationSchema: Yup.object().shape({
    Date: Yup.string().required('Date is required'),
    Mode: Yup.string().required('Mode is required'),
    Remark: Yup.string().required('Remark is required'),
    Amount: Yup.number().moreThan(0, 'Please type in correct amount'),
    // VoidReason: Yup.string().required(),
  }),
  handleSubmit: (values, { props }) => {
    props
      .dispatch({
        type: 'deposit/submit',
        payload: values,
      })
      .then((r) => {
        if (r && r.message === 'Ok') {
          // toast.success('test')
          notification.success({
            // duration:0,
            message: 'Done',
          })
          if (props.onConfirm) props.onConfirm()
        }
      })
  },
})
class Modal extends PureComponent {
  // getTotalPayAmount = () => {
  //   const { deposit } = this.props

  //   const getSum = (sum, payment) => sum + payment.payAmount
  //   const totalAmount = collectPaymentList.reduce(getSum, 0)

  //   return totalAmount
  // }

  render () {
    const { state, props } = this
    const { theme, classes, footer, onConfirm, values } = props

    const summaryCfg = {
      currency: true,
      formControlProps: {
        className: classes.summaryLabel,
      },
    }
    const commonAmountOpts = {
      currency: true,
      prefixProps: {
        style: { width: '100%' },
      },
    }
    // console.log(this.props)
    return (
      <React.Fragment>
        <div style={{ padding: '0 0' }}>
          <GridContainer
            direction='column'
            justify='center'
            alignItems='stretch'
          >
            <GridItem xs={12}>
              <Field
                name='Date'
                render={(args) => (
                  <DatePicker timeFomat={false} label='Date' {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <Field
                name='Mode'
                render={(args) => (
                  <Select label='Mode' options={paymentMethods} {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <Field
                name='Remark'
                render={(args) => (
                  <TextField multiline rowsMax='5' label='Remark' {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <Field
                name='Balance'
                render={(args) => (
                  <NumberInput
                    {...commonAmountOpts}
                    style={{
                      marginTop: theme.spacing.unit * 2,
                    }}
                    disabled
                    simple
                    prefix='Balance'
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <Field
                name='ODBalance'
                render={(args) => (
                  <NumberInput
                    {...commonAmountOpts}
                    prefixProps={{
                      style: { width: '267%' },
                    }}
                    disabled
                    simple
                    suffix='(Offset Deposit Balance)'
                    prefix=' '
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <Field
                name='Amount'
                render={(args) => (
                  <NumberInput
                    {...commonAmountOpts}
                    prefix='Amount'
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <Field
                name='NewBalance'
                render={(args) => (
                  <NumberInput
                    {...commonAmountOpts}
                    disabled
                    simple
                    prefix=' '
                    value={values.Amount - values.Balance}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
        </div>

        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmBtnText: formatMessage({
              id: 'form.save',
            }),
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default withStyles(style, { withTheme: true })(Modal)
