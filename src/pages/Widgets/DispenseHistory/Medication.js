import React from 'react'
import { CardContainer } from '@/components'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'
import numeral from 'numeral'
import { currencySymbol } from '@/utils/config'
import moment from 'moment'
import { Table } from 'antd'
import tablestyles from '../PatientHistory/PatientHistoryStyle.less'

export default ({ classes, current, fieldName = '' }) => {
  const drugMixtureIndicator = (row) => {
    if (row.type !== 'Medication' || !row.isDrugMixture) return null

    return (
      <div style={{ position: 'relative', top: 2 }}>
        <DrugMixtureInfo values={row.prescriptionDrugMixture} />
      </div>
    )
  }

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
      width: 105,
      render: (text, row) => (
        <span>{moment(row.visitDate).format('DD MMM YYYY')}</span>
      ),
    },
    {
      dataIndex: 'name',
      title: 'Name',
      width: 250,
      render: (text, row) => {
        return (
          <div style={{ position: 'relative' }}>
            <div className={classes.wrapCellTextStyle}>
              {row.name}
              {drugMixtureIndicator(row)}
            </div>
          </div>
        )
      },
    },
    {
      dataIndex: 'instruction',
      title: 'Instructions',
      width: 200,
    },
    {
      dataIndex: 'dispensedQuanity',
      title: 'Qty.',
      align: 'right',
      width: 80,
      render: (text, row) => (
        <div className={classes.numberstyle}>
          {`${numeral(row.dispensedQuanity || 0).format('0,0.00')}`}
        </div>
      ),
    },
    { dataIndex: 'dispenseUOM', title: 'UOM', width: 90 },
    {
      dataIndex: 'totalPrice',
      title: 'Subtotal',
      align: 'right',
      width: 90,
      render: (text, row) => showCurrency(row.totalPrice),
    },
    {
      dataIndex: 'adjAmt',
      title: 'Adj.',
      align: 'right',
      width: 80,
      render: (text, row) => showCurrency(row.adjAmt),
    },
    {
      dataIndex: 'totalAfterItemAdjustment',
      title: 'Total',
      align: 'right',
      width: 90,
      render: (text, row) => showCurrency(row.totalAfterItemAdjustment),
    },
    { dataIndex: 'remarks', title: 'Remarks' },
  ]

  return (
    <CardContainer hideHeader size='sm' style={{ margin: 0 }}>
      <Table
        size='small'
        bordered
        pagination={false}
        columns={tableColumns}
        dataSource={current.prescription || []}
        rowClassName={(record, index) => {
          return index % 2 === 0 ? tablestyles.once : tablestyles.two
        }}
        className={tablestyles.table}
      />
    </CardContainer>
  )
}
