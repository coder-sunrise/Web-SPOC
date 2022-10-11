import React from 'react'
import { CardContainer } from '@/components'
import numeral from 'numeral'
import { currencySymbol } from '@/utils/config'
import moment from 'moment'
import { Table } from 'antd'
import tablestyles from '../PatientHistory/PatientHistoryStyle.less'
import { Tooltip } from '@/components'
import { FileCopySharp } from '@material-ui/icons'

export default ({
  classes,
  current,
  fieldName = '',
  clinicSettings,
  isFullScreen = true,
}) => {
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

  const tableColumns = () => [
    {
      dataIndex: 'visitDate',
      title: 'Date',
      width: 90,
      render: (text, row) => (
        <span>{moment(row.visitDate).format('DD MMM YYYY')}</span>
      ),
    },
    {
      dataIndex: 'name',
      title: 'Name',
      width: isFullScreen ? 250 : 120,
      render: (text, row) => {
        let paddingRight = 0
        if ((row.isActualizedPreOrder || row.isPreOrder) && row.isExclusive) {
          paddingRight = 52
        } else if (
          row.isActualizedPreOrder ||
          row.isPreOrder ||
          row.isExclusive
        ) {
          paddingRight = 24
        }
        if (row.isDrugMixture) {
          paddingRight = 10
        }
        return (
          <div style={{ position: 'relative' }}>
            <div
              className={classes.wrapCellTextStyle}
              style={{ paddingRight: paddingRight }}
            >
              <Tooltip
                title={
                  <div>
                    {`Code: ${row.code}`}
                    <br />
                    {`Name: ${row.name}`}
                  </div>
                }
              >
                <div>{row.name}</div>
              </Tooltip>
              <div style={{ position: 'absolute', top: '-1px', right: '-4px' }}>
                {row.isExclusive && (
                  <Tooltip title='The item has no local stock, we will purchase on behalf and charge to patient in invoice'>
                    <div
                      className={classes.rightIcon}
                      style={{
                        borderRadius: 4,
                        backgroundColor: 'green',
                        display: 'inline-block',
                      }}
                    >
                      Excl.
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      dataIndex: 'instruction',
      title: 'Instructions',
      width: isFullScreen ? 200 : 110,
      render: text => (
        <Tooltip title={text}>
          <div>{text}</div>
        </Tooltip>
      ),
    },
    {
      dataIndex: 'dispensedQuanity',
      title: 'Qty.',
      align: 'right',
      width: isFullScreen ? 80 : 60,
      render: (text, row) => {
        const qty = `${numeral(row.dispensedQuanity || 0).format('0,0.0')}`
        return (
          <Tooltip title={qty}>
            <div>{qty}</div>
          </Tooltip>
        )
      },
    },
    {
      dataIndex: 'dispenseUOM',
      title: 'UOM',
      width: isFullScreen ? 100 : 80,
      render: text => (
        <Tooltip title={text}>
          <div>{text}</div>
        </Tooltip>
      ),
    },
    {
      dataIndex: 'totalPrice',
      title: 'Sub Total',
      align: 'right',
      width: isFullScreen ? 90 : 75,
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
      width: isFullScreen ? 90 : 75,
      render: (text, row) =>
        showCurrency(
          (row.isPreOrder && !row.isChargeToday) || row.hasPaid
            ? 0
            : row.totalAfterItemAdjustment,
        ),
    },
    {
      dataIndex: 'remarks',
      title: 'Remarks',
      render: (text, row) => {
        return (
          <div style={{ position: 'relative' }}>
            <div
              style={{
                minHeight: 20,
              }}
            >
              <Tooltip title={row.remarks}>
                <span className='oneline_textblock'> {row.remarks || ' '}</span>
              </Tooltip>
            </div>
          </div>
        )
      },
    },
  ]

  return (
    <div style={{ padding: 8 }}>
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
    </div>
  )
}
