import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { history } from 'umi'
import { FastField } from 'formik'
// dev grid
import { Table } from '@devexpress/dx-react-grid-material-ui'
// custom component
import {
  NumberInput,
  CommonTableGrid,
  GridItem,
  TextField,
  dateFormatLong,
} from '@/components'
import { number } from 'prop-types'
import consultation from '@/models/consultation'

const getRowId = row => row.id

class InvoiceListing extends PureComponent {
  state = {
    columns: [
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'copayerPayableAmount', title: 'Total Payable Amt.' },
      { name: 'copayerOutstanding', title: 'Outstanding' },
      { name: 'payAmount', title: 'Payment', nonEditable: false },
    ],
    columnExtensions: [
      {
        columnName: 'invoiceNo',
        sortingEnabled: false,
        width: 100,
      },
      {
        columnName: 'patientName',
        sortingEnabled: false,
      },
      {
        columnName: 'copayerPayableAmount',
        type: 'number',
        sortingEnabled: false,
        currency: true,
        width: 150,
      },
      {
        columnName: 'copayerOutstanding',
        type: 'number',
        sortingEnabled: false,
        currency: true,
        width: 120,
      },
      {
        columnName: 'invoiceDate',
        type: 'date',
        format: dateFormatLong,
        sortingEnabled: false,
        width: 100,
      },
      {
        columnName: 'payAmount',
        currency: true,
        sortingEnabled: false,
        render: row => {
          return (
            <GridItem xs={12}>
              <FastField
                name={`invoiceList[${row.rowIndex}].payAmount`}
                render={args => (
                  <NumberInput
                    {...args}
                    currency
                    disabled={row.copayerOutstanding > 0 ? false : true}
                    min={0}
                    max={row.copayerOutstanding}
                    simple
                    onChange={e => this.handlePaymentAmount(e)}
                  />
                )}
              />
            </GridItem>
          )
        },
        width: 150,
      },
    ],
  }

  handlePaymentAmount = e => {
    const {
      onTotalAmountChanges,
      dispatch,
      setFieldValue,
      values: { invoiceList },
    } = this.props

    const { name, value } = e.target
    const matches = name.match(/\[(.*?)\]/)
    let edittedIndex
    if (matches) {
      edittedIndex = parseInt(matches[1], 10)
    }

    let payAmount = 0
    if (typeof value === 'number') payAmount = value

    let rowIndex = 0
    let totalAmount = 0
    let newSelectedRows = []

    let newInvoiceList = invoiceList.map(item => {
      rowIndex++
      let newRow =
        rowIndex - 1 === edittedIndex ? { ...item, payAmount } : { ...item }
      if (newRow.payAmount > 0) {
        newSelectedRows.push(newRow.id)
        totalAmount += newRow.payAmount
      }
      return newRow
    })
    dispatch({
      type: 'billingDetails/updateState',
      payload: {
        totalPaidAmount: totalAmount,
        selectedRows: newSelectedRows,
        invoiceList: newInvoiceList,
      },
    })

    setFieldValue('invoiceList', newInvoiceList)
  }

  changeRowChanges = rowChanges => this.setState({ rowChanges })

  commitChanges = ({ changed }) => {
    const {
      billingDetails: { invoiceList },
      dispatch,
    } = this.props
    let updatedRows = []
    if (changed) {
      updatedRows = invoiceList.map(collectPaymentRow =>
        changed[collectPaymentRow.id]
          ? { ...collectPaymentRow, ...changed[collectPaymentRow.id] }
          : collectPaymentRow,
      )
    }
    dispatch({
      type: 'billingDetails/updateCollectPaymentList',
      payload: updatedRows,
    })
  }

  handleSelectionChange = rows => {
    const {
      selectedRows,
      setFieldValue,
      dispatch,
      billingDetails: { invoiceList },
    } = this.props
    let totalAmount = 0
    let newInvoiceList = invoiceList.map(item => {
      let newRow

      if (rows.includes(item.id))
        if (typeof item.payAmount === 'number' && item.payAmount > 0) {
          newRow = { ...item }
        } else newRow = { ...item, payAmount: item.copayerOutstanding }
      else newRow = { ...item, payAmount: 0 }

      if (newRow && newRow.payAmount > 0) totalAmount += newRow.payAmount

      return newRow
    })

    dispatch({
      type: 'billingDetails/updateState',
      payload: {
        totalPaidAmount: totalAmount,
        selectedRows: [...rows],
        invoiceList: newInvoiceList,
      },
    })
    setFieldValue('invoiceList', newInvoiceList)
  }

  render() {
    const { columns, columnExtensions } = this.state
    const {
      values: { invoiceList },
      billingDetails: { selectedRows },
      isEnableAddPayment,
    } = this.props
    return (
      <CommonTableGrid
        rows={invoiceList}
        columns={
          isEnableAddPayment
            ? columns
            : columns.filter(x => x.name !== 'payAmount')
        }
        columnExtensions={columnExtensions}
        getRowId={getRowId}
        forceRender
        FuncProps={{
          pager: false,
          filter: false,
          selectable: isEnableAddPayment,
          selectConfig: {
            showSelectAll: true,
            rowSelectionEnabled: row => {
              return row.copayerOutstanding > 0
            },
          },
        }}
        TableProps={{
          height: 'calc(100vh - 360px)',
        }}
        selection={selectedRows}
        onSelectionChange={this.handleSelectionChange}
      />
    )
  }
}

export default InvoiceListing
