import React, { PureComponent } from 'react'
import _ from 'lodash'
import moment from 'moment'
import { FastField } from 'formik'
import { withStyles } from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  NumberInput,
  CommonTableGrid,
  TextField,
  dateFormatLong,
  CodeSelect,
  Field,
  DatePicker,
  Select,
  ProgressButton,
} from '@/components'
import { DEFAULT_PAYMENT_MODE_GIRO } from '@/utils/constants'

const styles = () => ({
  grid: {
    marginTop: 10,
    marginBottom: 10,
  },
})

class CollectPaymentConfirm extends PureComponent {
  state = {
    isCardPayment: false,
    totalAmount: '',
    rows: [
      this.props.values.statementInvoice,
    ],
    columns: [
      { name: 'invoiceNo', title: 'Invoice No' },
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'adminCharge', title: 'Admin Charge' },
      { name: 'payableAmount', title: 'Payable Amount' },
      { name: 'outstandingAmount', title: 'Outstanding' },
      { name: 'payment', title: 'Payment' },
    ],
    columnExtensions: [
      {
        columnName: 'adminCharge',
        type: 'number',
        currency: true,
      },
      {
        columnName: 'payableAmount',
        type: 'number',
        currency: true,
      },
      {
        columnName: 'outstandingAmount',
        type: 'number',
        currency: true,
      },
      { columnName: 'invoiceDate', type: 'date', format: dateFormatLong },
      {
        columnName: 'payment',
        currency: true,
        render: (row) => {
          return (
            <GridItem xs={8}>
              <FastField
                name={`statementInvoice[${row.rowIndex}].tempOutstandingAmount`}
                render={(args) => (
                  <NumberInput
                    {...args}
                    currency
                    min={0}
                    onChange={(e) => this.handlePaymentAmount(e, 'grid')}
                  />
                )}
              />
            </GridItem>
          )
        },
      },
    ],
  }

  componentDidMount () {
    const { statement, setValues, values } = this.props
    const { statementInvoice } = statement.entity
    let total = 0

    const newStatementInvoice = statementInvoice.map((o) => {
      const { statementInvoicePayment, ...restStatementValues } = o
      total += o.outstandingAmount
      const invoicePayment = {
        totalAmtPaid: o.outstandingAmount,
        receiptNo: o.invoiceNo,
        invoicePayerFK: o.invoicePayerFK,
      }
      return {
        ...o,
        tempOutstandingAmount: o.outstandingAmount,
        statementInvoicePayment: [
          ...statementInvoicePayment,
        ],
      }
    })
    this.getBizList(moment().formatUTC('YYMMDD'))
    setValues({
      ...values,
      paymentDate: moment(),
      amount: total,
      maxAmount: total,
      paymentModeFK: DEFAULT_PAYMENT_MODE_GIRO.PAYMENT_FK, // GIRO
      displayValue: DEFAULT_PAYMENT_MODE_GIRO.DISPLAY_VALUE,
      statementInvoice: newStatementInvoice,
    })
    this.setState({
      rows: newStatementInvoice,
    })
  }

  handlePaymentAmount = (e, from) => {
    const { setFieldValue, statement, values, setValues } = this.props
    const { statementInvoice } = statement.entity

    if (from === 'grid') {
      const { name, value } = e.target
      const matches = name.match(/\[(.*?)\]/)
      let edittedIndex
      if (matches) {
        edittedIndex = parseInt(matches[1], 10)
      }
      const totalAmountPaid = _.sumBy(
        values.statementInvoice,
        'tempOutstandingAmount',
      )

      const currentStatement = values.statementInvoice[edittedIndex]
      const currentPayment = currentStatement.statementInvoicePayment.find(
        (o) => !o.id,
      )
      const { invoicePayment } = currentPayment
      invoicePayment.totalAmtPaid = value

      setFieldValue('amount', totalAmountPaid)
      return
    }
    let tempAmount = e.target.value
    const newStatementInvoice = values.statementInvoice.map((o) => {
      let totalAmtPaid
      if (tempAmount >= o.outstandingAmount) {
        totalAmtPaid = o.outstandingAmount
        tempAmount -= o.outstandingAmount
      } else {
        totalAmtPaid = tempAmount
        tempAmount = 0
      }
      const newStatementInvoicePayment = {
        statementInvoiceFK: o.id,
        invoicePayment: {
          totalAmtPaid,
          receiptNo: o.invoiceNo,
          invoicePayerFK: o.invoicePayerFK,
        },
      }
      let statementInvoicePayment
      const existingInvoicePayment = statementInvoice.find((i) => i.id === o.id)
      if (existingInvoicePayment) {
        statementInvoicePayment = [
          ...existingInvoicePayment.statementInvoicePayment,
          newStatementInvoicePayment,
        ]
      }

      return {
        ...o,
        tempOutstandingAmount: totalAmtPaid,
        statementInvoicePayment,
      }
    })
    setValues({
      ...values,
      amount: e.target.value,
      statementInvoice: newStatementInvoice,
    })
  }

  onChangeDate = (event) => {
    const selectedDate = moment(event).format('YYMMDD')
    this.getBizList(selectedDate)
  }

  getBizList = (e) => {
    const { dispatch, setFieldValue } = this.props
    dispatch({
      type: 'statement/bizSessionList',
      payload: {
        sessionNoPrefix: e,
        pagesize: 999,
      },
    }).then(() => {
      const { bizSessionList } = this.props.statement
      setFieldValue(
        'paymentCreatedBizSessionFK',
        bizSessionList.length === 0 || bizSessionList === undefined
          ? undefined
          : bizSessionList[0].value, // bizSessionList.slice(-1)[0].value,
      )
    })
  }

  onChangePaymentMode = (event, op) => {
    const { displayValue } = op
    const { setFieldValue } = this.props
    const selectedValue = event || ''
    if (selectedValue === 1) {
      this.setState({ isCardPayment: true })
      setFieldValue('creditCardTypeFK', 1)
    } else {
      this.setState({ isCardPayment: false })
      setFieldValue('cardNumber', '')
      setFieldValue('creditCardTypeFK', undefined)
    }
    setFieldValue('displayValue', displayValue)
  }

  render () {
    const { rows, columns, columnExtensions, isCardPayment } = this.state
    const { values, statement, handleSubmit } = this.props
    const { bizSessionList } = statement
    return (
      <React.Fragment>
        <CommonTableGrid
          rows={rows}
          columns={columns}
          columnExtensions={columnExtensions}
          FuncProps={{ pager: false }}
        />

        <GridContainer style={{ marginTop: 20 }} justify='flex-end'>
          <GridItem direction='column' justify='flex-end' md={3}>
            <GridItem>
              <FastField
                name='amount'
                render={(args) => (
                  <NumberInput
                    {...args}
                    currency
                    label='Amount'
                    autoFocus
                    onChange={this.handlePaymentAmount}
                  />
                )}
              />
            </GridItem>

            <GridItem>
              <Field
                name='paymentDate'
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

            <GridItem>
              <Field
                name='paymentCreatedBizSessionFK'
                render={(args) => (
                  <Select label='Session' options={bizSessionList} {...args} />
                )}
              />
            </GridItem>

            <GridItem>
              <Field
                name='paymentModeFK'
                render={(args) => (
                  <CodeSelect
                    {...args}
                    label='Payment Mode'
                    code='ctPaymentMode'
                    labelField='displayValue'
                    onChange={(e, op = {}) => this.onChangePaymentMode(e, op)}
                  />
                )}
              />
            </GridItem>

            {isCardPayment && (
              <React.Fragment>
                <GridItem>
                  <Field
                    name='creditCardTypeFK'
                    render={(args) => (
                      <CodeSelect
                        label='Card Type'
                        code='ctCreditCardType'
                        {...args}
                      />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <Field
                    name='cardNumber'
                    render={(args) => (
                      <NumberInput
                        label='Card Number'
                        inputProps={{ maxLength: 4 }}
                        maxLength={4}
                        {...args}
                      />
                    )}
                  />
                </GridItem>
              </React.Fragment>
            )}

            <GridItem>
              <FastField
                name='remarks'
                render={(args) => (
                  <TextField {...args} multiline label='Remarks' />
                )}
              />
            </GridItem>

            <GridItem style={{ float: 'right', padding: 0, marginTop: 10 }}>
              <ProgressButton color='primary' onClick={handleSubmit}>
                Confirm Payment
              </ProgressButton>
            </GridItem>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(CollectPaymentConfirm)
