import React, { PureComponent } from 'react'

// custom components
import { withStyles } from '@material-ui/core'
import {
  CommonTableGrid,
  dateFormatLong,
  CardContainer,
} from '@/components'
import * as service from '../services/index'
// sub components

const styles = () => ({})

class StatementPayment extends PureComponent {
  state = {
    rows: [],
    columns: [
      { name: 'receiptNo', title: 'Receipt No.' },
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'corporateCharge', title: 'Corporate Charge' },
      { name: 'statementAdjustment', title: 'Statement Adjustment' },
      { name: 'totalPayableAmt', title: 'Total Payable Amt.' },
      { name: 'payment', title: 'Payment' },
    ],
  }

  componentDidMount () {
    this.queryPaymentList()
  }

  queryPaymentList = async () => {
    console.log(this.props)
    const response = await service.queryStatementPaymentById(this.props.match.params.id)
    this.setState({
      rows: response.data.statementInvoicePayment.map((item, index) => ({
        ...item,
        id: index,
      })) || [],
    })
  }

  render () {
    const { rows, columns } = this.state

    return (
      <CardContainer hideHeader>
        <CommonTableGrid
          style={{ margin: 0 }}
          onRowDoubleClick={this.editRow}
          rows={rows}
          columns={columns}
          columnExtensions={[
            {
              columnName: 'receiptNo',
              sortBy: 'receiptNo',
              width: 130,
            },
            {
              columnName: 'invoiceNo',
              sortBy: 'invoiceNo',
              width: 130,
            },
            {
              columnName: 'invoiceDate',
              type: 'date',
              format: dateFormatLong,
              sortBy: 'invoiceDate',
              width: 120,
              sortingEnabled: false,
            },
            {
              columnName: 'patientName',
              sortBy: 'patientName',
            },
            {
              columnName: 'corporateCharge',
              type: 'number',
              currency: true,
              sortBy: 'corporateCharge',
              width: 140,
            },
            {
              columnName: 'statementAdjustment',
              type: 'number',
              currency: true,
              sortBy: 'statementAdjustment',
              width: 200,
            },
            {
              columnName: 'totalPayableAmt',
              type: 'number',
              currency: true,
              width: 140,
              sortBy: 'totalPayableAmt',
            },
            {
              columnName: 'payment',
              type: 'number',
              currency: true,
              width: 130,
              sortBy: 'payment',
            },
          ]}
          FuncProps={{
            pager: false,
          }}
        />
      </CardContainer>
    )
  }
}

export default withStyles(styles)(StatementPayment)
