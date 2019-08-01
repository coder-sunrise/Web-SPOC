import React, { PureComponent } from 'react'
import moment from 'moment'
import { FastField, withFormik } from 'formik'
import { withStyles } from '@material-ui/core'
import { formatMessage, FormattedMessage } from 'umi/locale'
import {
  GridContainer,
  GridItem,
  NumberInput,
  EditableTableGrid,
  CommonTableGrid,
} from '@/components'

const styles = () => ({
  grid: {
    marginTop: 10,
    marginBottom: 10,
  },
})

@withFormik({
  mapPropsToValues: () => ({
    PaymentAmount: 20,
    Total: 20,
  }),
})
class CollectPaymentConfirm extends PureComponent {
  state = {
    rows: [
      {
        id: 'PT-000001A',
        invoiceNo: 'IV-000001',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        amount: 100,
        outstandingBalance: 100,
        distributedAmount: 30,
      },
    ],
    columns: [
      { name: 'invoiceNo', title: 'Invoice No' },
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'amount', title: 'Payable Amount' },
      { name: 'outstandingBalance', title: 'O/S Balance' },
      { name: 'distributedAmount', title: 'Distributed Amount' },
    ],
    columnExtensions: [
      { columName: 'amount', type: 'number', currency: true },
      { columName: 'outstandingBalance', type: 'number', currency: true },
      { columName: 'invoiceDate', type: 'date' },
    ],
  }

  render () {
    const { rows, columns, columnExtensions } = this.state
    const { classes, footer, onConfirm } = this.props

    return (
      <React.Fragment>
        <GridContainer
          direction='column'
          justify='space-between'
          alignItems='center'
        >
          <GridItem className={classes.grid} xs md={6}>
            <FastField
              name='PaymentAmount'
              render={(args) => (
                <NumberInput
                  {...args}
                  disabled
                  currency
                  prefixProps={{ style: { width: '65%' } }}
                  prefix={formatMessage({
                    id: 'finance.collectPayment.paymentAmount',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem xs>
            <CommonTableGrid
              rows={rows}
              columns={columns}
              columnExtensions={columnExtensions}
              FuncProps={{ page: false }}
              height={300}
            />
          </GridItem>
        </GridContainer>
        <GridContainer
          classes={{ grid: classes.grid }}
          direction='column'
          justify='flex-end'
          alignItems='flex-end'
        >
          <GridItem xs md={6}>
            <FastField
              name='Total'
              render={(args) => (
                <NumberInput
                  {...args}
                  disabled
                  currency
                  prefix={formatMessage({
                    id: 'finance.collectPayment.total',
                  })}
                />
              )}
            />
          </GridItem>
        </GridContainer>
        {footer &&
          footer({
            onConfirm,
            confirmBtnText: formatMessage({
              id: 'finance.collectPayment.confirmPayment',
            }),
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(CollectPaymentConfirm)
