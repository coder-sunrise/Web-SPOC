import React from 'react'
import { Table } from 'antd'
import moment from 'moment'
import numeral from 'numeral'
import { currencySymbol } from '@/utils/config'
import { GridContainer, GridItem, TextField } from '@/components'
import { VISIT_TYPE } from '@/utils/constants'
import AmountSummary from './AmountSummary'
import tablestyles from './PatientHistoryStyle.less'

const numberstyle = {
  color: 'darkBlue',
  fontWeight: 500,
}

const baseColumns = [
  { dataIndex: 'itemType', title: 'Type', width: 150 },
  { dataIndex: 'itemName', title: 'Name' },
  {
    dataIndex: 'quantity',
    title: 'Quantity',
    align: 'right',
    width: 90,
    render: (text, row) => (
      <div style={numberstyle}>
        {`${numeral(row.quantity || 0).format('0,0.00')}`}
      </div>
    ),
  },
  { dataIndex: 'dispenseUOMDisplayValue', title: 'UOM', width: 100 },
  {
    dataIndex: 'adjAmt',
    title: 'Adj.',
    width: 120,
    align: 'right',
    render: (text, row) => (
      <div style={numberstyle}>
        {`${currencySymbol}${numeral(row.adjAmt || 0).format('0,0.00')}`}
      </div>
    ),
  },
  {
    dataIndex: 'totalAfterItemAdjustment',
    title: 'Total',
    width: 120,
    align: 'right',
    render: (text, row) => (
      <div style={numberstyle}>
        {`${currencySymbol}${numeral(row.totalAfterItemAdjustment || 0).format(
          '0,0.00',
        )}`}
      </div>
    ),
  },
]

export default ({ current, theme }) => {
  let invoiceAdjustmentData = []
  let columns = baseColumns

  if (current.invoice) {
    const {
      invoiceAdjustment = [],
      visitPurposeFK = VISIT_TYPE.CONS,
    } = current.invoice
    invoiceAdjustmentData = invoiceAdjustment

    if (
      visitPurposeFK === VISIT_TYPE.RETAIL ||
      visitPurposeFK === VISIT_TYPE.BILL_FIRST
    ) {
      columns = [
        { dataIndex: 'itemType', title: 'Type', width: 150 },
        { dataIndex: 'itemName', title: 'Name' },
        {
          dataIndex: 'description',
          title: 'Description',
        },
        {
          dataIndex: 'quantity',
          title: 'Quantity',
          align: 'right',
          width: 90,
          render: (text, row) => (
            <div style={numberstyle}>
              {`${numeral(row.quantity || 0).format('0,0.00')}`}
            </div>
          ),
        },
        {
          dataIndex: 'adjAmt',
          title: 'Adj',
          width: 120,
          align: 'right',
          render: (text, row) => (
            <div style={numberstyle}>
              {`${currencySymbol}${numeral(row.adjAmt || 0).format('0,0.00')}`}
            </div>
          ),
        },
        {
          dataIndex: 'totalAfterItemAdjustment',
          title: 'Total',
          width: 120,
          align: 'right',
          render: (text, row) => (
            <div style={numberstyle}>
              {`${currencySymbol}${numeral(
                row.totalAfterItemAdjustment || 0,
              ).format('0,0.00')}`}
            </div>
          ),
        },
      ]
    }
  }

  return (
    <div style={{ fontSize: '0.875rem', marginBottom: 8, marginTop: 8 }}>
      {current.invoice ? (
        <div style={{ marginBottom: 5 }}>
          <span>{`Invoice No: ${current.invoice.invoiceNo}`}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>
            {`Invoice Date: ${moment(current.invoice.invoiceDate).format(
              'DD MMM YYYY',
            )}`}
          </span>
        </div>
      ) : (
        ''
      )}
      <Table
        size='small'
        bordered
        pagination={false}
        columns={columns}
        dataSource={current.invoice ? current.invoice.invoiceItem : []}
        rowClassName={(record, index) => {
          return index % 2 === 0 ? tablestyles.once : tablestyles.two
        }}
        className={tablestyles.table}
      />
      <GridContainer style={{ paddingTop: theme.spacing(2) }}>
        <GridItem xs={2} md={9}>
          {current.invoice &&
          current.invoice.remark && (
            <div style={{ marginLeft: -8 }}>
              <span style={{ fontWeight: 500 }}>Invoice Remarks:</span>
              <TextField
                inputRootCustomClasses={tablestyles.historyText}
                noUnderline
                multiline
                disabled
                value={current.invoice.remark || ''}
              />
            </div>
          )}
        </GridItem>
        <GridItem xs={10} md={3}>
          <AmountSummary
            adjustments={invoiceAdjustmentData}
            invoice={current.invoice}
          />
        </GridItem>
      </GridContainer>
    </div>
  )
}
