import React, { PureComponent } from 'react'
import { connect } from 'dva'
import classNames from 'classnames'
import { formatMessage, FormattedMessage } from 'umi/locale'
import moment from 'moment'
import lodash from 'lodash'
import numeral from 'numeral'
import update from 'immutability-helper'
import * as Yup from 'yup'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'

import {
  Grid,
  Divider,
  Tooltip,
  Paper,
  InputAdornment,
  ClickAwayListener,
  withStyles,
} from '@material-ui/core'
import { Money, CreditCard, Close } from '@material-ui/icons'

import {
  RadioButtonGroup,
  FormField,
  DatePicker,
  Select,
  notification,
  SimpleModal,
  CommonModal,
  NumberInput,
} from '@/components'
import { CustomInput, Button, Timeline } from 'mui-pro-components'

import { sleep, sumReducer, currencyFormat } from '@/utils/utils'
import { getUniqueGUID } from '@/utils/cdrss'

const styles = (theme) => ({
  actionButton: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
  actionButtonName: {
    position: 'absolute',
    left: 20,
  },
  actionButtonShortcut: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    position: 'absolute',
    right: 20,
  },
  amountButton: {
    [theme.breakpoints.up('sm')]: {
      position: 'absolute',
      right: 40,
      top: 13,
      width: '70%',
    },
  },
  container: {
    marginTop: theme.spacing.unit,
    maxHeight: 'calc(100vh - 375px)',
    overflowY: 'auto',
  },
  summaryLabel: {
    paddingTop: 0,
  },
})
const rowCfg = {
  container: true,
  justify: 'center',
  spacing: 8,
}
const colCfg = {
  item: true,
  xs: 6,
  sm: true,
}

const paymentNames = [
  'Cash',
  'Nets',
  'Credit Card',
  'Cheque',
  'TT',
  'GIRO',
  'Admin Fees',
]
const paymentIcons = [
  Money,
  <CreditCard color='action' />,
  CreditCard,
  'Cheque',
  'TT',
  'GIRO',
  'Admin Fees',
]

const getExtraFields = (o, i) => {
  switch (o.Type) {
    case 'Credit Card':
      return (
        <React.Fragment>
          <Grid {...rowCfg}>
            <Grid {...colCfg} sm={3} xs={12}>
              <FastField
                name={`Payments[${i}].CardType`}
                render={(args) => {
                  return (
                    <Select
                      label='Card Type'
                      options={[
                        { name: 'Visa', value: 'Visa' },
                        { name: 'Master', value: 'Master' },
                      ]}
                      {...args}
                    />
                  )
                }}
              />
            </Grid>
            <Grid {...colCfg} sm={9} xs={12}>
              <FastField
                name={`Payments[${i}].CardNumber`}
                render={(args) => {
                  return <CustomInput label='Card No.' creditCard {...args} />
                }}
              />
            </Grid>
          </Grid>
        </React.Fragment>
      )
    case 'Cheque':
      return (
        <FastField
          name={`Payments[${i}].ChequeNumber`}
          render={(args) => {
            return <CustomInput label='Cheque No.' {...args} />
          }}
        />
      )
    case 'TT':
    case 'GIRO':
      return (
        <FastField
          name={`Payments[${i}].ReferenceNumber`}
          render={(args) => {
            return <CustomInput label='Reference No.' {...args} />
          }}
        />
      )
    default:
      break
  }
}
const paymentTypes = paymentNames.map((o, i) => {
  return {
    name: o,
    icon: paymentIcons[i],
    order: i + 1,
    keyCode: 112 + i,
    handler: (c) => {
      window.dispatchEvent(
        new KeyboardEvent('keyup', { keyCode: 112 + i, ctrlKey: true }),
      )
    },
    render: getExtraFields,
  }
})
@connect(({ addPayment }) => ({
  addPayment,
}))
@withFormik({
  mapPropsToValues: (com) => {
    const outstanding = 10
    return {
      Payer: 'Singapore Airline',
      TotalPayable: 12,
      CashReceived: outstanding,
      Outstanding: outstanding,
      TotalAmount: outstanding,
      Date: moment(),
      Payments: [
        {
          Amount: outstanding,
          Remark: '',
          Type: 'Cash',
        },
      ],
    }
  },
  validationSchema: Yup.object().shape({
    Payments: Yup.array().of(
      Yup.object().shape({
        Remark: Yup.string().required('Remark is required'),
      }),
    ),
    // VoidReason: Yup.string().required(),
  }),

  handleSubmit: (values, { props }) => {
    props
      .dispatch({
        type: 'addPayment/submit',
        payload: values,
      })
      .then((r) => {
        if (r.message === 'Ok') {
          // toast.success('test')
          notification.success({
            // duration:0,
            message: 'Done',
          })
          if (props.onConfirm) props.onConfirm()
        }
      })
  },
  displayName: 'AddPayment',
})
class AddPayment extends React.Component {
  state = {}

  static getDerivedStateFromProps (nextProps, preState) {
    const { values } = nextProps
    if (values) {
      const totalAmount = values.Payments
        .map((o) => o.Amount)
        .reduce(sumReducer, 0)
      const balOutstanding = totalAmount - values.Outstanding
      const cashReceived = values.Payments
        .filter((o) => o.Type === 'Cash')
        .map((o) => o.Amount)
        .reduce(sumReducer, 0)
      const cashReturn = cashReceived - totalAmount
      const canSubmit = totalAmount <= values.Outstanding
      return {
        totalAmount,
        balOutstanding,
        cashReceived,
        cashReturn,
        canSubmit,
      }
    }
    return null
  }

  componentDidMount () {
    window.onkeyup = (e) => {
      let key = e.keyCode ? e.keyCode : e.which
      if (e.ctrlKey) {
        const pt = paymentTypes.find((o) => o.keyCode === key)
        const { canSubmit, totalAmount } = this.state
        // console.log(pt)
        if (pt) {
          switch (key) {
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
              this.paymentArrayHelpers.push({
                Id: getUniqueGUID(),
                Type: pt.name,
                Remark: '',
                Amount: canSubmit
                  ? this.props.values.Outstanding - totalAmount
                  : 0,
              })
              break

            default:
              break
          }
        }
      }
    }
  }

  render () {
    // console.log(this)
    const { state, props } = this
    const { theme, classes, values, footer } = props
    const {
      totalAmount,
      balOutstanding,
      cashReceived,
      cashReturn,
      canSubmit,
    } = state

    const inptCfg = {
      disabled: true,
    }
    const summaryCfg = {
      currency: true,
      formControlProps: {
        className: classes.summaryLabel,
      },
    }
    return (
      <React.Fragment>
        <div>
          <Paper style={{ padding: theme.spacing.unit }}>
            <Grid {...rowCfg}>
              <Grid {...colCfg}>
                <FastField
                  name='Payer'
                  render={(args) => {
                    return (
                      <CustomInput
                        label={formatMessage({
                          id: 'finance.payment.add.payment.payer',
                        })}
                        {...inptCfg}
                        {...args}
                      />
                    )
                  }}
                />
              </Grid>
              <Grid {...colCfg}>
                <FastField
                  name='TotalPayable'
                  render={(args) => {
                    return (
                      <NumberInput
                        label={formatMessage({
                          id: 'finance.payment.add.payment.totalpayable',
                        })}
                        currency
                        {...inptCfg}
                        {...args}
                      />
                    )
                  }}
                />
              </Grid>
              <Grid {...colCfg}>
                <FastField
                  name='Outstanding'
                  render={(args) => (
                    <NumberInput
                      label={formatMessage({
                        id: 'finance.payment.add.payment.outstanding',
                      })}
                      currency
                      {...inptCfg}
                      {...args}
                    />
                  )}
                />
              </Grid>
              <Grid {...colCfg}>
                <FastField
                  name='Date'
                  render={(args) => (
                    <DatePicker
                      label={formatMessage({
                        id: 'finance.payment.add.payment.date',
                      })}
                      timeFormat={false}
                      {...inptCfg}
                      disabled={false}
                      {...args}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Paper>
          <Grid container>
            <Grid item xs={3}>
              <Grid
                container
                direction='column'
                justify='flex-start'
                alignItems='stretch'
              >
                {paymentTypes.map((o, i) => (
                  <Grid item key={o.name}>
                    <Button
                      className={classes.actionButton}
                      color='primary'
                      onClick={o.handler}
                    >
                      <span className={classes.actionButtonName}>
                        {o.name}
                      </span>{' '}
                      &nbsp;{' '}
                      <span className={classes.actionButtonShortcut}>
                        (CTRL + F{o.order})
                      </span>
                    </Button>
                  </Grid>
                ))}
                <Grid />
              </Grid>
            </Grid>
            <Grid item xs={9} className={classes.container}>
              <FieldArray
                name='Payments'
                render={(arrayHelpers) => {
                  this.paymentArrayHelpers = arrayHelpers
                  return (
                    <Timeline
                      simple
                      stories={values.Payments.map((o, i) => {
                        const paymentType = paymentTypes.find(
                          (m) => m.name === o.Type,
                        )
                        let color = 'gray'
                        if (o.Amount > 0) {
                          color =
                            o.Amount <= values.Outstanding && canSubmit
                              ? 'success'
                              : 'danger'
                        }
                        return {
                          inverted: true,
                          value: o,
                          badgeColor: color,
                          badgeIcon: paymentType.icon,
                          title: paymentType.name,
                          titleButton: (
                            <Button
                              color='transparent'
                              aria-label='Delete'
                              justIcon
                              onClick={() => {
                                arrayHelpers.remove(i)
                              }}
                            >
                              <Close style={{ width: 16, height: 16 }} />
                            </Button>
                          ),
                          titleColor: color,
                          body: (
                            <div>
                              <FastField
                                name={`Payments[${i}].Amount`}
                                render={(args) => {
                                  return (
                                    <NumberInput
                                      className={classes.amountButton}
                                      prefix='Amount'
                                      currency
                                      {...args}
                                    />
                                  )
                                }}
                              />
                              {paymentType.render(o, i)}
                              <FastField
                                name={`Payments[${i}].Remark`}
                                render={(args) => {
                                  return (
                                    <CustomInput
                                      label='Remarks'
                                      multiline
                                      {...args}
                                    />
                                  )
                                }}
                              />
                            </div>
                          ),
                        }
                      })}
                    />
                  )
                }}
              />
            </Grid>
          </Grid>
          <Divider />
          <Grid
            container
            direction='row'
            justify='space-around'
            alignItems='center'
          >
            <Grid item xs={6}>
              <Grid item style={{ padding: theme.spacing.unit }}>
                &nbsp;
              </Grid>
              <Grid
                item
                style={{ padding: theme.spacing.unit, fontWeight: 'bold' }}
              >
                Balance Outstanding:&nbsp;
                <CustomInput
                  disabled
                  value={
                    balOutstanding > 0 ? (
                      `(${numeral(balOutstanding).format(currencyFormat)})`
                    ) : (
                      numeral(Math.abs(balOutstanding)).format(currencyFormat)
                    )
                  }
                  fullWidth={false}
                  {...summaryCfg}
                />
              </Grid>
              <Grid item style={{ padding: theme.spacing.unit }}>
                &nbsp;
              </Grid>
              <Grid item style={{ padding: theme.spacing.unit }}>
                &nbsp;
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Grid
                container
                direction='column'
                justify='center'
                alignItems='stretch'
              >
                <Grid item style={{ padding: theme.spacing.unit }}>
                  Totoal Amount:{' '}
                </Grid>
                <Grid item style={{ padding: theme.spacing.unit }}>
                  Cash Discount:{' '}
                </Grid>
                <Grid item style={{ padding: theme.spacing.unit }}>
                  Cash Received:{' '}
                </Grid>
                <Grid item style={{ padding: theme.spacing.unit }}>
                  Cash Returned:{' '}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Grid
                container
                direction='column'
                justify='center'
                alignItems='stretch'
              >
                <Grid item>
                  <Field
                    name='TotalAmount'
                    render={(args) => (
                      <NumberInput
                        disabled
                        value={totalAmount}
                        error={
                          !canSubmit ? (
                            'Total Amount should great than 0 and less or equal to Outstanding Balance'
                          ) : (
                            ''
                          )
                        }
                        showErrorIcon
                        {...summaryCfg}
                      />
                    )}
                  />
                </Grid>
                <Grid item>
                  <FastField
                    name='CashDiscount'
                    render={(args) => (
                      <CustomInput disabled {...summaryCfg} {...args} />
                    )}
                  />
                </Grid>
                <Grid item>
                  <NumberInput value={cashReceived} disabled {...summaryCfg} />
                </Grid>
                <Grid item>
                  <NumberInput value={cashReturn} disabled {...summaryCfg} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmProps: {
              disabled: !canSubmit && totalAmount > 0,
            },
          })}
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(AddPayment)
