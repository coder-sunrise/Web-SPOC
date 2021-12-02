import React from 'react'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { ReportDataGrid } from '@/components/_medisys'
import { GridContainer, GridItem, NumberInput } from '@/components'
import InvoicePayer from './InvoicePayer'

const Summary = ({ reportDatas }) => {
  if (!reportDatas) return null
  let listData = []
  const { PaymentModeDetails, InvoicePayerDetail } = reportDatas
  if (PaymentModeDetails) {
    listData = PaymentModeDetails.map((item, index) => ({
      ...item,
      id: `${item.mode}-${index}`,
    }))
  }

  const SummaryTableColumn = [
    { name: 'mode', title: 'Mode' },
    { name: 'queue', title: 'Queue' },
    { name: 'past', title: 'Past' },
    { name: 'subTotal', title: 'Sub Total' },
  ]

  const SummaryTableColumnExtension = [
    { columnName: 'mode', sortingEnabled: false },
    {
      columnName: 'queue',
      type: 'currency',
      currency: true,
      sortingEnabled: false,
    },
    {
      columnName: 'past',
      type: 'currency',
      currency: true,
      sortingEnabled: false,
    },
    {
      columnName: 'subTotal',
      type: 'currency',
      currency: true,
      sortingEnabled: false,
    },
  ]

  const FuncProps = {
    pager: false,
    summary: true,
    summaryConfig: {
      state: {
        totalItems: [
          { columnName: 'queue', type: 'sum' },
          { columnName: 'past', type: 'sum' },
          { columnName: 'subTotal', type: 'sum' },
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
  return (
    <GridContainer md={6} style={{ marginBottom: 8 }}>
      <GridItem md={12}>
        <ReportDataGrid
          noHeight
          data={listData}
          columns={SummaryTableColumn}
          columnExtensions={SummaryTableColumnExtension}
          FuncProps={FuncProps}
        />
      </GridItem>
      <GridItem md={12} style={{ marginTop: '10px' }}>
        <span
          style={{
            display: 'inline-block',
            textAlign: 'left',
            fontWeight: '500',
            width: '160px',
          }}
        >
          Total Cash Collected:
        </span>
        <NumberInput
          prefix=''
          currency
          style={{ padding: '0px 8px', width: '100px', textAlign: 'right' }}
          text
          value={PaymentModeDetails.reduce((pre, cur) => {
            return pre + cur.cashCollected
          }, 0)}
        />
      </GridItem>
      <GridItem md={12}>
        <span
          style={{
            display: 'inline-block',
            textAlign: 'left',
            fontWeight: '500',
            width: '160px',
          }}
        >
          Total Cash Rounding:
        </span>
        <NumberInput
          currency
          text
          style={{ padding: '0px 8px', width: '100px', textAlign: 'right' }}
          value={PaymentModeDetails.reduce((pre, cur) => {
            return pre + cur.cashRounding
          }, 0)}
        />
      </GridItem>
      <GridItem md={12}>
        <span
          style={{
            display: 'inline-block',
            textAlign: 'left',
            fontWeight: '500',
            width: '160px',
          }}
        >
          Co-Payer Payable Amt.:
        </span>
        <NumberInput
          currency
          text
          style={{ padding: '0px 8px', width: '100px', textAlign: 'right' }}
          value={InvoicePayerDetail.reduce((pre, cur) => {
            return pre + cur.coPayerPayable
          }, 0)}
        />
      </GridItem>
      <GridItem md={12} style={{ marginTop: '10px' }}>
        <InvoicePayer reportDatas={reportDatas} />
      </GridItem>
    </GridContainer>
  )
}

export default Summary
