import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Field, withFormik } from 'formik'
import moment from 'moment'
import * as Yup from 'yup'
import { formatMessage } from 'umi/locale'
import { withStyles, Grid } from '@material-ui/core'
import { paymentMethods } from '@/utils/codes'

import {
  GridContainer,
  GridItem,
  NumberInput,
  TextField,
  DatePicker,
  Select,
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
  mapPropsToValues: ({ deposit }) => {
    if (deposit.entity) {
      return { ...deposit.entity, date: moment(), amount: 0, mode: 'cash' }
    } else {
      return deposit.default
    }
  },
  validationSchema: Yup.object().shape({
    date: Yup.string().required('Date is required'),
    mode: Yup.string().required('Mode is required'),
    amount: Yup.number().moreThan(0, 'Please type in correct amount'),
  }),
  validate: (values, props) => {
    let errors = {}

    if (
      moment(values.date).format('YYMMDD') == moment().format('YYMMDD') &&
      props.isDeposit
    ) {
    } else {
      if (!values.session) {
        errors.session = 'This is a required field'
      }
    }

    return errors
  },
  handleSubmit: (values, { props }) => {
    // props
    //   .dispatch({
    //     type: 'deposit/submit',
    //     payload: values,
    //   })
    //   .then((r) => {
    //     if (r && r.message === 'Ok') {
    //       // toast.success('test')
    //       notification.success({
    //         // duration:0,
    //         message: 'Done',
    //       })
    //       if (props.onConfirm) props.onConfirm()
    //     }
    //   })
  },
})
class Modal extends PureComponent {
  constructor (props) {
    super(props)
    const { isDeposit, deposit } = this.props
    const { entity } = deposit
    this.state = {
      balanceAfter: entity.balance || 0,
      isSessionRequired: isDeposit ? false : true,
      isCardPayment: false,
    }
  }

  onChangeDate = (event) => {
    const { dispatch, setFieldValue, isDeposit } = this.props
    const selectedDate = moment(event).format('YYMMDD')

    if (isDeposit && selectedDate == moment().format('YYMMDD')) {
      this.setState({ isSessionRequired: false })
    } else {
      this.setState({ isSessionRequired: true })

      dispatch({
        type: 'deposit/bizSessionList',
        payload: {
          sessionNoPrefix: selectedDate,
          pagesize: 999999,
        },
      }).then(() => {
        const { bizSessionList } = this.props.deposit
        setFieldValue(
          'session',
          bizSessionList.length == 0 || bizSessionList === undefined
            ? ''
            : bizSessionList[0].value,
        )
      })
    }
  }

  onChangePaymentMode = (event) => {
    const { setFieldValue } = this.props
    const selectedValue = event || ''

    if (selectedValue.trim().toLowerCase() == 'creditcard') {
      this.setState({ isCardPayment: true })
      setFieldValue('cardType', 'Visa')
    } else {
      this.setState({ isCardPayment: false })
      setFieldValue('cardNumber', '')
    }
  }

  calculateBalanceAfter = () => {
    console.log('props', this.props)
    const { isDeposit, errors, initialValues } = this.props
    const { balance, amount } = this.props.values || 0

    if (!errors.amount) {
      this.setState({
        balanceAfter: isDeposit ? balance + amount : balance - amount,
      })
    } else {
      this.setState({
        balanceAfter: initialValues.balance,
      })
    }
  }

  render () {
    const { state, props } = this
    const { theme, footer, onConfirm, values, isDeposit, deposit } = props
    const { bizSessionList, entity } = deposit
    const { isSessionRequired, isCardPayment } = this.state
    const commonAmountOpts = {
      currency: true,
      prefixProps: {
        style: { width: '100%' },
      },
    }
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
                name='date'
                render={(args) => (
                  <DatePicker
                    timeFomat={false}
                    onChange={this.onChangeDate}
                    disabledDate={(d) => !d || d.isAfter(moment())}
                    label='Date'
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              {isSessionRequired ? (
                <Field
                  name='session'
                  render={(args) => (
                    <Select
                      label='Session'
                      options={bizSessionList}
                      {...args}
                    />
                  )}
                />
              ) : (
                ''
              )}
            </GridItem>
            <GridItem xs={12}>
              <Field
                name='mode'
                render={(args) => (
                  <Select
                    label='Mode'
                    onChange={this.onChangePaymentMode}
                    options={paymentMethods}
                    {...args}
                  />
                )}
              />
            </GridItem>

            <GridItem xs={12}>
              {isCardPayment ? (
                <Field
                  name='cardType'
                  render={(args) => <Select label='Card Type' {...args} />}
                />
              ) : (
                ''
              )}
            </GridItem>
            <GridItem xs={12}>
              {isCardPayment ? (
                <Field
                  name='cardNumber'
                  render={(args) => <TextField label='Card Number' {...args} />}
                />
              ) : (
                ''
              )}
            </GridItem>
            <GridItem xs={12}>
              <Field
                name='remarks'
                render={(args) => (
                  <TextField multiline rowsMax='5' label='Remarks' {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <Field
                name='depositRefundRemarks'
                render={(args) => (
                  <TextField
                    multiline
                    rowsMax='5'
                    prefix={isDeposit ? 'Deposit Remarks' : 'Refund Remarks'}
                    label={isDeposit ? 'Deposit Remarks' : 'Refund Remarks'}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <Field
                name='balance'
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
                name='amount'
                render={(args) => (
                  <NumberInput
                    onChange={this.calculateBalanceAfter}
                    {...commonAmountOpts}
                    prefix={isDeposit ? 'Deposit Amount' : 'Refund Amount'}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <Field
                name='balanceAfter'
                render={(args) => (
                  <NumberInput
                    {...commonAmountOpts}
                    disabled
                    simple
                    value={this.state.balanceAfter}
                    prefix=' '
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
