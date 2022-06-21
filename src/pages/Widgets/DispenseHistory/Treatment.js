import React from 'react'
import { CardContainer, Tooltip } from '@/components'
import numeral from 'numeral'
import { currencySymbol } from '@/utils/config'
import moment from 'moment'
import { Table } from 'antd'
import tablestyles from '../PatientHistory/PatientHistoryStyle.less'

export default ({ classes, current, fieldName = '', isFullScreen = true }) => {
  const showCurrency = (value = 0) => {
    if (value >= 0)
      return (
        <div className={classes.numberstyle}>
          {`${currencySymbol}${numeral(value).format('0,0.00')}`}
        </div>
      )
    return (
      <div className={classes.negativeNumberstyle}>
        {`(${currencySymbol}${numeral(value * -1).format('0,0.00')})`}
      </div>
    )
  }
  const tableColumns = [
    {
      dataIndex: 'visitDate',
      title: 'Date',
      width: 90,
      render: (text, row) => (
        <span>{moment(row.visitDate).format('DD MMM YYYY')}</span>
      ),
    },
    {
      dataIndex: 'description',
      title: 'Name',
      width: isFullScreen ? 250 : 140,
    },
    { dataIndex: 'category', title: 'Category', width: 100 },
    {
      dataIndex: 'quantity',
      title: 'Qty.',
      align: 'right',
      width: isFullScreen ? 80 : 60,
      render: (text, row) => {
        const qty = `${numeral(row.quantity || 0).format('0,0.0')}`
        return (
          <Tooltip title={qty}>
            <div>{qty}</div>
          </Tooltip>
        )
      },
    },
    {
      dataIndex: 'totalPrice',
      title: 'Sub Total',
      align: 'right',
      width: isFullScreen ? 90 : 80,
      render: (text, row) => showCurrency(row.totalPrice),
    },
    {
      dataIndex: 'adjAmt',
      title: 'Adj.',
      align: 'right',
      width: isFullScreen ? 80 : 70,
      render: (text, row) => showCurrency(row.adjAmt),
    },
    {
      dataIndex: 'totalAfterItemAdjustment',
      title: 'Total',
      align: 'right',
      width: isFullScreen ? 90 : 80,
      render: (text, row) => showCurrency(row.totalAfterItemAdjustment),
    },
    { dataIndex: 'remarks', title: 'Remarks' },
  ]
  return (
    <div style={{ padding: 8 }}>
      <Table
        size='small'
        bordered
        pagination={false}
        columns={tableColumns}
        dataSource={current.treatment || []}
        rowClassName={(record, index) => {
          return index % 2 === 0 ? tablestyles.once : tablestyles.two
        }}
        className={tablestyles.table}
      />
    </div>
  )
}
