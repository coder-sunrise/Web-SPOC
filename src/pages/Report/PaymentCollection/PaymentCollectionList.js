import React, { PureComponent } from 'react'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { ReportDataGrid } from '@/components/_medisys'
import { GridItem, dateFormatLongWithTimeNoSec12h } from '@/components'

class PaymentCollectionList extends PureComponent {
  render() {
    let paymentCollectionData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas.PaymentCollectionDetails) {
      paymentCollectionData = reportDatas.PaymentCollectionDetails.map(
        (item, index) => ({
          ...item,
          id: `PaymentCollectionDetails-${index}-${item.invoiceNo}`,
        }),
      )
    }

    const PaymentCollectionDetailsExtensions = [
      {
        columnName: 'paymentReceivedDate',
        sortingEnabled: false,
        width: 200,
        type: 'date',
        format: dateFormatLongWithTimeNoSec12h,
        showTime: true,
      },
      {
        columnName: 'amount',
        type: 'currency',
        currency: true,
        sortingEnabled: false,
        width: 180,
      },
      { columnName: 'receiptNo', sortingEnabled: false, width: 100 },
      { columnName: 'referenceNo', sortingEnabled: false, width: 100 },
      { columnName: 'payerName', sortingEnabled: false },
      { columnName: 'remark', sortingEnabled: false },
      { columnName: 'doctorName', sortingEnabled: false },
      { columnName: 'visitType', sortingEnabled: false, width: 150 },
      { columnName: 'invoiceNo', sortingEnabled: false, width: 100 },
      { columnName: 'invoiceDate', sortingEnabled: false, width: 100 },
      { columnName: 'paymentMode', sortingEnabled: false },
      { columnName: 'patientName', sortingEnabled: false },
    ]
    let FuncProps = {
      pager: false,
      summary: true,
    }

    if (reportDatas.PaymentCollectionInfo[0].groupByPaymentMode) {
      let cashData = []
      let giroData = []
      let otherData = []
      if (paymentCollectionData.length > 0) {
        cashData = paymentCollectionData.filter(
          item => item.paymentMode === 'CASH',
        )
        giroData = paymentCollectionData.filter(
          item => item.paymentMode === 'GIRO',
        )
        otherData = paymentCollectionData.filter(
          item => !(item.paymentMode === 'GIRO' || item.paymentMode === 'CASH'),
        )
      }
      const OtherPaymentModeDetailsCols = [
        { name: 'paymentReceivedDate', title: 'Date' },
        { name: 'receiptNo', title: 'Receipt No.' },
        { name: 'referenceNo', title: 'Ref. No.' },
        { name: 'payerName', title: 'Payer Name' },
        { name: 'remark', title: 'Remarks' },
        { name: 'doctorName', title: 'Optom.' },
        { name: 'visitType', title: 'Visit Type' },
        { name: 'invoiceNo', title: 'Invoice No.' },
        { name: 'invoiceDate', title: 'Inv. Date' },
        { name: 'amount', title: 'Amount' },
        { name: 'paymentMode', title: 'Payment Mode' },
      ]
      const GIRODetailsCols = [
        { name: 'paymentReceivedDate', title: 'Date' },
        { name: 'receiptNo', title: 'Receipt No.' },
        { name: 'referenceNo', title: 'Ref. No.' },
        { name: 'payerName', title: 'Payer Name' },
        { name: 'patientName', title: 'Patient Name' },
        { name: 'remark', title: 'Remarks' },
        { name: 'doctorName', title: 'Optometrist' },
        { name: 'visitType', title: 'Visit Type' },
        { name: 'invoiceNo', title: 'Invoice No.' },
        { name: 'invoiceDate', title: 'Inv. Date' },
        { name: 'amount', title: 'Amount' },
        { name: 'paymentMode', title: 'Payment Mode' },
      ]
      FuncProps = {
        ...FuncProps,
        grouping: true,
        groupingConfig: {
          state: {
            grouping: [{ columnName: 'paymentMode' }],
          },
        },
        summaryConfig: {
          state: {
            totalItems: [],
            groupItems: [{ columnName: 'amount', type: 'sum' }],
          },
          integrated: {
            calculator: IntegratedSummary.defaultCalculator,
          },
          row: {
            messages: {
              sum: 'Total',
            },
          },
        },
      }
      const CashFuncProps = {
        ...FuncProps,
        summaryConfig: {
          state: {
            totalItems: [],
            groupItems: [
              { columnName: 'amount', type: 'sum' },
              { columnName: 'cashRounding', type: 'sum' },
              { columnName: 'netAmount', type: 'sum' },
            ],
          },
          integrated: {
            calculator: IntegratedSummary.defaultCalculator,
          },
          row: {
            messages: {
              sum: 'Total',
            },
          },
        },
      }
      const CashDetailsCols = [
        ...OtherPaymentModeDetailsCols,
        { name: 'cashRounding', title: 'Cash Rounding' },
        { name: 'netAmount', title: 'Net Amount' },
      ]
      const CashColsExtension = [
        ...PaymentCollectionDetailsExtensions,
        {
          columnName: 'cashRounding',
          type: 'currency',
          currency: true,
          sortingEnabled: false,
          width: 180,
        },
        {
          columnName: 'netAmount',
          type: 'currency',
          currency: true,
          sortingEnabled: false,
          width: 180,
        },
      ]
      return (
        <GridItem md={12}>
          {cashData && cashData.length > 0 && (
            <div style={{ margin: '8px 0px' }}>
              <ReportDataGrid
                data={cashData}
                columns={CashDetailsCols}
                columnExtensions={CashColsExtension}
                FuncProps={CashFuncProps}
              />
            </div>
          )}
          {giroData && giroData.length > 0 && (
            <div style={{ margin: '8px 0px' }}>
              <ReportDataGrid
                data={giroData}
                columns={GIRODetailsCols}
                columnExtensions={PaymentCollectionDetailsExtensions}
                FuncProps={FuncProps}
              />
            </div>
          )}
          {otherData && otherData.length > 0 && (
            <div style={{ margin: '8px 0px' }}>
              <ReportDataGrid
                data={otherData}
                columns={OtherPaymentModeDetailsCols}
                columnExtensions={PaymentCollectionDetailsExtensions}
                FuncProps={FuncProps}
              />
            </div>
          )}
        </GridItem>
      )
    }
    if (reportDatas.PaymentCollectionInfo[0].groupByDoctor) {
      FuncProps = {
        ...FuncProps,
        summaryConfig: {
          state: {
            totalItems: [],
            groupItems: [{ columnName: 'amount', type: 'sum' }],
          },
          integrated: {
            calculator: IntegratedSummary.defaultCalculator,
          },
          row: {
            messages: {
              sum: 'Total',
            },
          },
        },
        grouping: true,
        groupingConfig: {
          state: {
            grouping: [{ columnName: 'doctorName' }],
          },
        },
      }
    } else {
      FuncProps = {
        ...FuncProps,
        summaryConfig: {
          state: {
            totalItems: [{ columnName: 'amount', type: 'sum' }],
          },
          integrated: {
            calculator: IntegratedSummary.defaultCalculator,
          },
          row: {
            messages: {
              sum: 'Total',
            },
          },
        },
      }
    }
    const PaymentCollectionDetailsCols = [
      { name: 'paymentReceivedDate', title: 'Date' },
      { name: 'receiptNo', title: 'Receipt No.' },
      { name: 'referenceNo', title: 'Ref. No.' },
      { name: 'payerName', title: 'Payer Name' },
      { name: 'doctorName', title: 'Optom.' },
      { name: 'visitType', title: 'Visit Type' },
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'invoiceDate', title: 'Inv. Date' },
      { name: 'amount', title: 'Amount' },
      { name: 'paymentMode', title: 'Payment Mode' },
    ]

    return (
      <ReportDataGrid
        data={paymentCollectionData}
        columns={PaymentCollectionDetailsCols}
        columnExtensions={PaymentCollectionDetailsExtensions}
        FuncProps={FuncProps}
      />
    )
  }
}
export default PaymentCollectionList
