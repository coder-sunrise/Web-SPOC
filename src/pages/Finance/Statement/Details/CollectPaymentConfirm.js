import React, { PureComponent } from 'react'
import moment from 'moment'
import { FastField } from 'formik'
import { withStyles } from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  NumberInput,
  CommonTableGrid,
  TextField,
  Button,
  dateFormatLong,
  CodeSelect,
  Field,
  DatePicker,
  Select,
} from '@/components'

const styles = () => ({
  grid: {
    marginTop: 10,
    marginBottom: 10,
  },
})

class CollectPaymentConfirm extends PureComponent {
  state = {
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
      { columnName: 'invoiceDate', type: 'date', format: { dateFormatLong } },
      {
        columnName: 'payment',
        currency: true,
        render: (row) => {
          return (
            <GridItem xs={8}>
              <FastField
                name={`statementInvoice[${row.rowIndex}].invoicePayment.totalAmtPaid`}
                render={(args) => (
                  <NumberInput
                    {...args}
                    currency
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
        invoicePayment,
        statementInvoicePayment: [
          {
            ...restStatementValues,
            invoicePayment,
          },
        ],
      }
    })
    this.getBizList(moment().formatUTC('YYMMDD'))

    setValues({
      ...values,
      paymentDate: moment(),
      amount: total,
      maxAmount: total,
      paymentMode: 5,
      statementInvoice: newStatementInvoice,
    })
    this.setState({
      rows: newStatementInvoice,
    })
  }

  handlePaymentAmount = (e, from) => {
    const { setFieldValue, statement, values, setValues } = this.props
    console.log('statement', values)

    if (from === 'grid') {
      this.setState({ totalAmount: e.target.value })
      setFieldValue('amount', e.target.value)
      return
    }
    this.setState({ totalAmount: e.target.value })
    let tempAmount = e.target.value
    const test = values.statementInvoice.map((o) => {
      let totalAmtPaid
      const newStatementInvoicePayment = o.statementInvoicePayment.map((i) => {
        if (tempAmount >= i.outstandingAmount) {
          totalAmtPaid = i.outstandingAmount
          tempAmount -= i.outstandingAmount
        } else {
          totalAmtPaid = tempAmount
        }
        return {
          ...i,
          invoicePayment: {
            totalAmtPaid,
            receiptNo: i.invoiceNo,
            invoicePayerFK: i.invoicePayerFK,
          },
        }
      })
      return {
        ...o,
        statementInvoicePayment: newStatementInvoicePayment,
        invoicePayment: {
          totalAmtPaid,
        },
      }
    })

    console.log('testt', test)
    setValues({
      ...values,
      statementInvoice: test,
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
        pagesize: 999999,
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

  render () {
    const { rows, columns, columnExtensions } = this.state
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

        <GridContainer style={{ marginTop: 20 }}>
          <GridItem direction='column' md={6}>
            <GridItem md={6}>
              <FastField
                name='amount'
                render={(args) => (
                  <NumberInput
                    {...args}
                    currency
                    label='Amount'
                    onChange={this.handlePaymentAmount}
                  />
                )}
              />
            </GridItem>

            <GridItem md={6}>
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

            <GridItem md={6}>
              <Field
                name='paymentCreatedBizSessionFK'
                render={(args) => (
                  <Select label='Session' options={bizSessionList} {...args} />
                )}
              />
            </GridItem>

            <GridItem md={6}>
              <FastField
                name='paymentMode'
                render={(args) => (
                  <CodeSelect
                    {...args}
                    label='Payment Mode'
                    code='ctPaymentMode'
                    labelField='displayValue'
                  />
                )}
              />
            </GridItem>

            <GridItem md={6}>
              <FastField
                name='remarks'
                render={(args) => (
                  <TextField {...args} multiline label='Remarks' />
                )}
              />
            </GridItem>

            <GridItem style={{ marginTop: 10 }} md={6}>
              <Button color='primary' onClick={handleSubmit}>
                Confirm Payment
              </Button>
            </GridItem>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(CollectPaymentConfirm)
