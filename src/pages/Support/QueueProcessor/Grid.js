import React, { PureComponent } from 'react'

import { Table } from '@devexpress/dx-react-grid-material-ui'
import Delete from '@material-ui/icons/Delete'
import { CommonTableGrid, Button, Tooltip, dateFormatLongWithTime } from '@/components'
import { queueProcessorType, queueItemStatus } from '@/utils/codes'
import * as service from './services'

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
          return queueItemStatus.find(x => x.value === row.queueProcessTypeFK).name
        },
      },
      { columnName: 'requestedBy', width: 140 },
      {
        columnName: 'createDate', width: 180,
        type: 'date',
        format: dateFormatLongWithTime,
      },
      {
        columnName: 'updateDate', width: 180,
        type: 'date',
        format: dateFormatLongWithTime,
      },
      {
        columnName: 'result', width: 260,
        render: (row) => {
          return this.formatResultMessage(row)
        },
      },
      {
        columnName: 'action',
        align: 'center',
        render: (row) => {
          return (
            <Tooltip title='Cancel'>
              <Button
                size='sm'
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
    const { list } = queueProcessor
    dispatch({
      type: 'settingRoom/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  render () {
    const { dispatch, classes, queueProcessor, toggleModal } = this.props

    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='queueProcessor'
        // onRowDoubleClick={this.editRow}
        {...this.configs}
      />
    )
  }
}

export default Grid
