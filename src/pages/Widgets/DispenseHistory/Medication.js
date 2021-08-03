import React from 'react'
import { CardContainer } from '@/components'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'
import numeral from 'numeral'
import { currencySymbol } from '@/utils/config'
import moment from 'moment'
import { Table } from 'antd'
import tablestyles from '../PatientHistory/PatientHistoryStyle.less'
import {
  Tooltip,
} from '@/components'
import { FileCopySharp } from '@material-ui/icons'

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
            <div className={classes.wrapCellTextStyle}
              style={{ paddingRight: row.isPreOrder ? 24 : 0 }}>
              {row.name}
              {drugMixtureIndicator(row)}
              {row.isPreOrder &&
                <Tooltip title='Pre-Order'>
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: -6,
                      borderRadius: 10,
                      backgroundColor: '#4255bd',
                      fontWeight: 500,
                      color: 'white',
                      fontSize: '0.7rem',
                      padding: '1px 3px',
                      height: 20,
                    }}
                  > Pre</div>
                </Tooltip>}
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
      render: (text, row) => showCurrency((row.isPreOrder && !row.isChargeToday) ? 0 : row.totalAfterItemAdjustment),
    },
    {
      dataIndex: 'remarks', title: 'Remarks', render: (text, row) => {
        const existsDrugLabelRemarks = row.drugLabelRemarks && row.drugLabelRemarks.trim() !== ''
        return <div style={{ position: 'relative', paddingRight: existsDrugLabelRemarks ? 10 : 0 }}>
          <div
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >{row.remarks || ' '}</div>
          {existsDrugLabelRemarks &&
            <div style={{
              position: 'absolute',
              bottom: -2,
              right: -5,
            }}>
              <Tooltip title={
                <div>
                  <div style={{ fontWeight: 500 }}>Drug Label Remarks</div>
                  <div>{row.drugLabelRemarks}
                  </div>
                </div>
              }>
                <FileCopySharp style={{ color: 'blue' }} />
              </Tooltip>
            </div>
          }
        </div>
      },
    }
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
