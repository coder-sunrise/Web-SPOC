import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import * as Yup from 'yup'
import { formatMessage } from 'umi'
import { withStyles, Divider } from '@material-ui/core'
import { getBizSession } from '@/services/queue'
import Authorized from '@/utils/Authorized'
import {
  GridContainer,
  GridItem,
  NumberInput,
  TextField,
  DatePicker,
  Select,
  CodeSelect,
  Field,
  withFormikExtend,
  notification,
  serverDateFormat,
} from '@/components'

const style = () => ({
  totalPayment: {
    textAlign: 'right',
  },
  summaryLabel: {
    paddingTop: 0,
  },
  label: {
    textAlign: 'right',
    fontSize: '1rem',
    lineHeight: 1.5,
    fontWeight: 400,
  },
})

@connect(({ deposit, codetable }) => ({
  deposit,
  codetable,
}))
@withFormikExtend({
  authority: 'finance/deposit',
  mapPropsToValues: ({
    deposit,
    isDeposit,
    maxTranseferAmount,
    invoicePayerFK,
  }) => {
    let transactionTypeFK = 2
    let transactionType = 'Refund'
    if (isDeposit) {
      if (invoicePayerFK) {
        transactionTypeFK = 4
        transactionType = 'Transfer'
      } else {
        transactionTypeFK = 1
        transactionType = 'Deposit'
      }
    }
    if (deposit.entity) {
      const { patientDepositTransaction } = deposit.entity
      const transactionModeFK = isDeposit ? undefined : 3
      return {
        ...deposit.entity,
        balance: deposit.entity.balance ? deposit.entity.balance : 0,
        patientDepositTransaction: {
          patientDepositFK: deposit.entity.patientDepositFK,
          transactionType,
          transactionTypeFK,
          transactionModeFK,
          amount: maxTranseferAmount || 0,
          maxTranseferAmount,
        },
        balanceAfter:
          (deposit.entity.balance ? deposit.entity.balance : 0) +
          (maxTranseferAmount || 0),
        hasTransactionBefore: !!patientDepositTransaction,
        invoicePayerFK,
      }
    }
    return {
      ...deposit.default,
      patientDepositTransaction: {
        ...deposit.default.patientDepositTransaction,
        amount: maxTranseferAmount || 0,
        maxTranseferAmount,
        transactionType,
        transactionTypeFK,
      },
      balanceAfter: maxTranseferAmount || 0,
      invoicePayerFK,
    }
  },
  validationSchema: ({ deposit }) => {
    const balance = deposit.entity
      ? deposit.entity.balance
      : deposit.default.balance

    const amountSchema = Yup.number().when(
      ['transactionTypeFK', 'maxTranseferAmount'],
      (transactionTypeFK, maxTranseferAmount) => {
        if (transactionTypeFK === 2)
          return Yup.number()
            .min(0.01, 'The amount should be more than 0.01')
            .max(balance, 'The amount should not exceed the balance.')
        else if (maxTranseferAmount) {
          return Yup.number()
            .min(0.01, 'The amount should be more than 0.01')
            .max(
              maxTranseferAmount,
              `The amount should less than or equal to ${maxTranseferAmount}.`,
            )
        } else
          return Yup.number().min(0.01, 'The amount should be more than 0.01')
      },
    )
    return Yup.object().shape({
      patientDepositTransaction: Yup.object().when('invoicePayerFK', {
        is: val => !val,
        then: Yup.object().shape({
          transactionDate: Yup.string().required('Date is required'),
          transactionBizSessionFK: Yup.number().required(),
          transactionModeFK: Yup.number().required('Mode is required'),
          amount: amountSchema,
          creditCardTypeFK: Yup.number().when('transactionModeFK', {
            is: val => val === 1,
            then: Yup.number().required(),
          }),
        }),
        otherwise: Yup.object().shape({
          transactionDate: Yup.string().required('Date is required'),
          transactionBizSessionFK: Yup.number().required(),
          amount: amountSchema,
        }),
      }),
    })
  },
  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, codetable, deposit, isDeposit } = props
    const {
      balanceAfter,
      patientDepositTransaction,
      hasTransactionBefore,
      invoicePayerFK,
    } = values
    const {
      transactionModeFK,
      creditCardTypeFK,
      transactionBizSessionFK,
      remarks,
      ...restDepositTransaction
    } = patientDepositTransaction
    const { ctpaymentmode, ctcreditcardtype } = codetable
    let transactionMode
    let creditCardType
    if (!invoicePayerFK) {
      transactionMode = ctpaymentmode.find(o => o.id === transactionModeFK)
        .displayValue
      if (transactionModeFK === 1) {
        creditCardType = ctcreditcardtype.find(o => o.id === creditCardTypeFK)
          .name
      }
    }
    const transType = patientDepositTransaction.transactionType
    dispatch({
      type: 'deposit/updateDeposit',
      payload: {
        ...values,
        id: deposit?.entity?.id || undefined,
        concurrencyToken: deposit?.entity?.concurrencyToken,
        balance: balanceAfter,
        patientDepositTransaction: {
          ...restDepositTransaction,
          transactionMode,
          creditCardType,
          transactionModeFK,
          creditCardTypeFK,
          createdByBizSessionFK: transactionBizSessionFK,
          transactionBizSessionFK,
          remarks: invoicePayerFK
            ? remarks
            : remarks ||
              (isDeposit
                ? 'Deposit for treatments'
                : 'Refund from patient deposit account'),
        },
      },
    }).then(r => {
      if (r) {
        notification.success({
          message: `${transType} successfully`,
        })
        if (onConfirm) onConfirm()
        dispatch({
          type: 'deposit/updateState',
          payload: {
            entity: r,
          },
        })
      }
    })
  },
  displayName: 'Deposit',
})
class Modal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isSessionRequired: false,
      isCardPayment: false,
      paymentMode: [],
    }
  }

  componentDidMount() {
    const { dispatch, isDeposit, patient } = this.props
    // if entry from invoice history - deposit, then need to get by patient.
    if (patient?.entity?.id) {
      dispatch({
        type: 'deposit/getPatientDeposit',
        payload: {
          patientProfileFK: patient?.entity?.id,
        },
      }).then(r => {
        dispatch({
          type: 'deposit/updateState',
          payload: {
            entity: r.data,
          },
        })
      })
    }
    this.fetchLatestBizSessions()
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctpaymentmode',
      },
    }).then(v => {
      let paymentMode = v
      if (isDeposit) {
        paymentMode = v.filter(o => o.code !== 'DEPOSIT')
      }
      this.setState({ paymentMode })
    })
  }

  fetchLatestBizSessions = () => {
    const { setFieldValue } = this.props
    const payload = {
      pagesize: 1,
      sorting: [{ columnName: 'sessionStartDate', direction: 'desc' }],
    }
    getBizSession(payload).then(response => {
      const { status, data } = response
      if (parseInt(status, 10) === 200 && data.totalRecords > 0) {
        const { data: sessionData } = data
        const { isClinicSessionClosed, sessionStartDate } = sessionData[0]
        let paymentDate = moment()
        if (isClinicSessionClosed === true) {
          paymentDate = moment(sessionStartDate, serverDateFormat)
        }
        setFieldValue(
          'patientDepositTransaction.transactionDate',
          paymentDate.format(serverDateFormat),
        )
        setFieldValue(
          'patientDepositTransaction.transactionBizSessionFK',
          sessionData[0].id,
        )

        this.getBizList(paymentDate.format(serverDateFormat))
      } else {
        setFieldValue('patientDepositTransaction.transactionDate', null)
        setFieldValue(
          'patientDepositTransaction.transactionBizSessionFK',
          undefined,
        )
      }
    })
  }

  onChangeDate = event => {
    if (event) {
      const { isDeposit } = this.props
      const selectedDate = moment(event).format('YYMMDD')

      if (isDeposit && selectedDate === moment().format('YYMMDD')) {
        this.setState({ isSessionRequired: false })
      } else {
        this.setState({ isSessionRequired: true })
      }
      this.getBizList(event)
    }
  }

  getBizList = date => {
    const { dispatch, setFieldValue } = this.props
    const momentDate = moment(date, serverDateFormat)

    const startDateTime = moment(
      momentDate.set({ hour: 0, minute: 0, second: 0 }),
    ).formatUTC(false)
    const endDateTime = moment(
      momentDate.set({ hour: 23, minute: 59, second: 59 }),
    ).formatUTC(false)

    dispatch({
      type: 'deposit/bizSessionList',
      payload: {
        pagesize: 999,
        lsteql_SessionStartDate: endDateTime,
        group: [
          {
            isClinicSessionClosed: false,
            lgteql_SessionCloseDate: startDateTime,
            combineCondition: 'or',
          },
        ],
        sorting: [{ columnName: 'sessionStartDate', direction: 'desc' }],
      },
    }).then(() => {
      const { bizSessionList } = this.props.deposit
      setFieldValue(
        'patientDepositTransaction.transactionBizSessionFK',
        bizSessionList === undefined || bizSessionList.length === 0
          ? undefined
          : bizSessionList[0].value,
      )
    })
  }

  onChangePaymentMode = event => {
    const { setFieldValue } = this.props
    const selectedValue = event || ''

    if (selectedValue === 1) {
      this.setState({ isCardPayment: true })
      setFieldValue('patientDepositTransaction.creditCardTypeFK', 1)
    } else {
      this.setState({ isCardPayment: false })
      setFieldValue('patientDepositTransaction.creditCardTypeFK', undefined)
    }
  }

  calculateBalanceAfter = event => {
    const { value = 0 } = event.target
    const { isDeposit, errors, initialValues, setFieldValue } = this.props
    const { balance } = this.props.values || 0
    let finalBalance
    if (!errors.amount) {
      finalBalance = isDeposit ? balance + value : balance - value
    } else {
      finalBalance = initialValues.balance
    }
    setFieldValue('balanceAfter', finalBalance)
  }

  render() {
    const { props } = this
    const { classes, footer, isDeposit, deposit, invoicePayerFK } = props
    const { bizSessionList } = deposit
    const { isCardPayment, paymentMode } = this.state
    const commonAmountOpts = {
      currency: true,
      fullWidth: true,
      noUnderline: true,
    }
    const accessRight = Authorized.check('finance.deposit.addtopastsession')

    const allowAddToPastSession = accessRight && accessRight.rights === 'enable'

    return (
      <React.Fragment>
        <div>
          <GridContainer>
            <GridItem xs={12}>
              <Field
                name='patientDepositTransaction.transactionDate'
                render={args => (
                  <DatePicker
                    timeFomat={false}
                    onChange={this.onChangeDate}
                    disabledDate={d => !d || d.isAfter(moment())}
                    label='Date'
                    autoFocus
                    disabled={!allowAddToPastSession}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <Field
                name='patientDepositTransaction.transactionBizSessionFK'
                render={args => (
                  <Select
                    label='Session'
                    options={bizSessionList}
                    {...args}
                    disabled={!allowAddToPastSession}
                  />
                )}
              />
            </GridItem>

            <GridItem xs={12}>
              {!invoicePayerFK && (
                <Field
                  name='patientDepositTransaction.transactionModeFK'
                  render={args => (
                    <Select
                      label='Mode'
                      onChange={e => this.onChangePaymentMode(e)}
                      options={paymentMode}
                      labelField='displayValue'
                      valueField='id'
                      {...args}
                    />
                  )}
                />
              )}
            </GridItem>

            <GridItem xs={12}>
              {!invoicePayerFK && isCardPayment && (
                <Field
                  name='patientDepositTransaction.creditCardTypeFK'
                  render={args => (
                    <CodeSelect
                      label='Card Type'
                      code='ctCreditCardType'
                      {...args}
                    />
                  )}
                />
              )}
            </GridItem>

            <GridItem xs={12}>
              {!invoicePayerFK && (
                <Field
                  name='patientDepositTransaction.modeRemarks'
                  render={args => (
                    <TextField
                      multiline
                      rowsMax='3'
                      label='Mode Remarks'
                      maxLength={200}
                      {...args}
                    />
                  )}
                />
              )}
            </GridItem>

            <GridItem xs={12}>
              <Field
                name='patientDepositTransaction.remarks'
                render={args => (
                  <TextField
                    multiline
                    rowsMax='5'
                    label={isDeposit ? 'Deposit Remarks' : 'Refund Remarks'}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>

          <GridContainer alignItems='center' justify='center'>
            <GridItem md={3} />
            <GridItem md={3} className={classes.label}>
              {!invoicePayerFK && <span>Balance</span>}
            </GridItem>

            <GridItem md={3}>
              {!invoicePayerFK && (
                <Field
                  name='balance'
                  render={args => (
                    <NumberInput
                      defaultValue='0.00'
                      disabled
                      {...commonAmountOpts}
                      {...args}
                    />
                  )}
                />
              )}
            </GridItem>
            <GridItem md={3} />
            <GridItem md={3} />
            <GridItem md={3} className={classes.label}>
              <span>{isDeposit ? 'Deposit Amount' : 'Refund Amount'}</span>
            </GridItem>
            <GridItem md={3}>
              <Field
                name='patientDepositTransaction.amount'
                render={args => (
                  <NumberInput
                    defaultValue='0.00'
                    onChange={this.calculateBalanceAfter}
                    {...commonAmountOpts}
                    min={0}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem md={3} />
            <GridItem md={3} />
            <GridItem md={6}>{!invoicePayerFK && <Divider />}</GridItem>
            <GridItem md={3} />
            <GridItem md={3} />
            <GridItem md={3}>
              {!invoicePayerFK && (
                <Field
                  name='balanceAfter'
                  render={args => (
                    <NumberInput
                      style={{ top: -5 }}
                      {...commonAmountOpts}
                      disabled
                      defaultValue='0.00'
                      {...args}
                    />
                  )}
                />
              )}
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
