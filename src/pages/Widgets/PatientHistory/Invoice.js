import React from 'react'
import { Table } from 'antd'
import moment from 'moment'
import numeral from 'numeral'
import { Tag } from 'antd'
import { currencySymbol } from '@/utils/config'
import { GridContainer, GridItem, TextField, Tooltip } from '@/components'
import { VISIT_TYPE } from '@/utils/constants'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'
import AmountSummary from './AmountSummary'
import tablestyles from './PatientHistoryStyle.less'

const numberstyle = {
  color: 'darkBlue',
  fontWeight: 500,
}

const negativeNumberstyle = {
  color: 'red',
  fontWeight: 500,
}

const wrapCellTextStyle = {
  wordWrap: 'break-word',
  whiteSpace: 'pre-wrap',
}

const drugMixtureIndicator = (row) => {
  if (row.itemType !== 'Medication' || !row.isDrugMixture) return null

  return (
    <div style={{ position: 'relative', top: 5 }}>
      <DrugMixtureInfo values={row.prescriptionDrugMixture} />
    </div>
  )
}

const showCurrency = (value = 0) => {
  if (value >= 0)
    return (
      <div style={numberstyle}>
        {`${currencySymbol}${numeral(value).format('0,0.00')}`}
      </div>
    )
  return (
    <div style={negativeNumberstyle}>
      {`(${currencySymbol}${numeral(value * -1).format('0,0.00')})`}
    </div>
  )
}

const baseColumns = [
  {
    dataIndex: 'itemType',
    title: 'Type',
    width: 140,
    render: (text, row) => {
      return (
        <div style={{ position: 'relative' }}>
          <div style={wrapCellTextStyle}>
            {row.isDrugMixture ? 'Drug Mixture' : row.itemType}
            {drugMixtureIndicator(row)}
            {row.isPreOrder && <Tooltip title='Pre-Order'><Tag color="#4255bd" style={{ position: 'absolute', top: 0, right: -10, borderRadius: 10 }}>Pre</Tag></Tooltip>}
          </div>
        </div>
      )
    },
  },
  { dataIndex: 'itemName', title: 'Name', width: 250 },
  {
    dataIndex: 'description',
    title: 'Instructions',
  },
  {
    dataIndex: 'quantity',
    title: 'Qty.',
    align: 'right',
    width: 80,
    render: (text, row) => (
      <div style={numberstyle}>
        {`${numeral(row.quantity || 0).format('0,0.0')}`}
      </div>
    ),
  },
  { dataIndex: 'dispenseUOMDisplayValue', title: 'UOM', width: 80 },
  {
    dataIndex: 'adjAmt',
    title: 'Adj.',
    width: 100,
    align: 'right',
    render: (text, row) => showCurrency(row.adjAmt),
  },
  {
    dataIndex: 'totalAfterItemAdjustment',
    title: 'Total',
    width: 100,
    align: 'right',
    render: (text, row) => showCurrency((row.isPreOrder && !row.isChargeToday) ? 0 : row.totalAfterItemAdjustment),
  },
]

export default ({ current, theme, isFullScreen = true }) => {
  let invoiceAdjustmentData = []
  let columns = baseColumns

  if (current.invoice) {
    const { invoiceAdjustment = [] } = current.invoice
    invoiceAdjustmentData = invoiceAdjustment
  }

  return (
    <div style={{ fontSize: '0.85rem', marginBottom: 8, marginTop: 8 }}>
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
        <GridItem xs={12} sm={6} md={isFullScreen ? 8 : 6}>
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
        <GridItem xs={12} sm={6} md={isFullScreen ? 4 : 6}>
          <AmountSummary
            adjustments={invoiceAdjustmentData}
            invoice={current.invoice}
          />
        </GridItem>
      </GridContainer>
    </div>
  )
}
