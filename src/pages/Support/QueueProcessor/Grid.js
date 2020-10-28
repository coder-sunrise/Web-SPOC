import React, { PureComponent } from 'react'

import { Table } from '@devexpress/dx-react-grid-material-ui'
import moment from 'moment'
import { connect } from 'dva'
import Delete from '@material-ui/icons/Delete'
import { CommonTableGrid, Button, Tooltip, dateFormatLong, dateFormatLongWithTime } from '@/components'
import { queueProcessorType, queueItemStatus } from '@/utils/codes'
import * as service from './services'

@connect(({ queueProcessor }) => ({
  queueProcessor,
}))

class Grid extends PureComponent {
  configs = {
    columns: [
      { name: 'queueProcessTypeFK', title: 'Process Type' },
      { name: 'requestedBy', title: 'Requested By' },
      { name: 'createDate', title: 'Request Date' },
      { name: 'updateDate', title: 'Completed Date' },
      { name: 'queueProcessStatusFK', title: 'Status' },
      { name: 'data', title: 'Request Parameter' },
      { name: 'result', title: 'Result Message' },
      {
        name: 'action',
        title: 'Action',
      },
    ],
    columnExtensions: [
      {
        columnName: 'queueProcessTypeFK', width: 220,
        render: (row) => {
          return queueProcessorType.find(x => x.value === row.queueProcessTypeFK).name
        },
      },
      {
        columnName: 'queueProcessStatusFK', width: 110,
        render: (row) => {
          return queueItemStatus.find(x => x.value === row.queueProcessStatusFK).name
        },
      },
      { columnName: 'requestedBy', width: 140 },
      {
        columnName: 'createDate', width: 180,
        type: 'date',
        showTime: true,
      },
      {
        columnName: 'updateDate', width: 180,
        type: 'date',
        showTime: true,
      },
      {
        columnName: 'data',
        render: (row) => {
          let result = this.formatParameter(row)
          return (
            <Tooltip title={result} placement='top'>
              <div>{result}</div>
            </Tooltip>
          )
        },
        sortingEnabled: false,
      },
      {
        columnName: 'result', width: 260,
        render: (row) => {
          let result = this.formatResultMessage(row)
          return (
            <Tooltip title={result} placement='top'>
              <div>{result}</div>
            </Tooltip>
          ) 
        },
        sortingEnabled: false,
      },
      {
        columnName: 'action',
        align: 'center',
        render: (row) => {
          return (
            <Tooltip title='Cancel'>
              <Button
                size='sm'
                disabled={row.queueProcessStatusFK !== 1}                
                onClick={() => {
                  this.cancelQueue(row)
                }}
                justIcon
                color='danger'
              >
                <Delete />
              </Button>
            </Tooltip>
          )
        },
      },
    ],
  }

  formatParameter = (row) => {
    let type = row.queueProcessTypeFK
    if (type === 1) {
      let parameter = JSON.parse(row.data)
      return `Statement Date: ${moment(parameter.StatementDate).format(dateFormatLong)}, Payment Terms: ${parameter.PaymentTerms} day(s), Invoice Date From: ${parameter.InvoiceDateFrom ? moment(parameter.InvoiceDateFrom).format(dateFormatLong) : '-'}, Invoice Date To: ${parameter.InvoiceDateTo ? moment(parameter.InvoiceDateTo).format(dateFormatLong) : '-'}`
    }
    return ''
  }

  formatResultMessage = (row) => {
    let type = row.queueProcessTypeFK
    if (type === 1) {
      if (row.queueProcessStatusFK === 3) {
        return `${(JSON.parse(row.result) || []).length} statement(s) has been generated`
      }
    }
    return ''
  }

  cancelQueue = (row, e) => {
    const { dispatch, queueProcessor } = this.props
    const { id } = row
    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmContent: `Cancel this queue item?`,
        onConfirmSave: () => {
          dispatch({
            type: 'queueProcessor/cancelQueue',
            payload: {
              id,
            },
          }).then(() => {
            this.props.dispatch({
              type: 'queueProcessor/query',
            })
          })
        },
      },
    }) 
  }

  render () {
    const { dispatch, classes, queueProcessor, toggleModal } = this.props

    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='queueProcessor' 
        {...this.configs}
      />
    )
  }
}

export default Grid
