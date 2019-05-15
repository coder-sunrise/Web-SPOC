import React, { PureComponent } from 'react'
import router from 'umi/router'
import moment from 'moment'
import { Table } from '@devexpress/dx-react-grid-material-ui'

import { Tooltip, withStyles } from '@material-ui/core'
import { PanTool, Edit, Search } from '@material-ui/icons'
import { sleep, getAppendUrl } from '@/utils/utils'
import { status, suppliers, dispUOMs } from '@/utils/codes'

import { Button, CommonModal, CommonTableGrid2 } from '@/components'

class BatchList extends PureComponent {
  state = {
    pageSizes: [
      5,
      10,
      15,
    ],
    selection: [],
    showDepositRefundModal: false,
    tableParas: {
      columns: [
        { name: 'refNo', title: 'Batch No.' },
        { name: 'expenseDate', title: 'Receiving Date' },
        { name: 'invoiceDate', title: 'Expiry Date' },
        { name: 'quantity', title: 'Quantity' },
      ],
      columnExtensions: [
        {
          columnName: 'quantity',
          type: 'number',
        },
        {
          columnName: 'invoiceDate',
          type: 'date',
        },
        {
          columnName: 'expenseDate',
          type: 'date',
        },
      ],
    },
  }

  componentDidMount () {}

  Cell = ({ column, row, dispatch, classes, ...props }) => {
    // console.log(this)
    if (column.name === 'Action') {
      return (
        <Table.Cell {...props}>
          <Tooltip title='Detail' placement='bottom'>
            <Button
              size='sm'
              onClick={() => {
                this.props.history.push(
                  getAppendUrl({
                    md: 'pt',
                    cmt: 'dmgp',
                    pid: row.Id,
                  }),
                )
              }}
              justIcon
              round
              color='primary'
              style={{ marginRight: 5 }}
            >
              <Search />
            </Button>
          </Tooltip>
          <Tooltip title='Edit' placement='bottom'>
            <Button
              size='sm'
              onClick={() => {
                // this.props.history.push(
                //   getAppendUrl({
                //     md: 'pt',
                //     cmt: 'dmgp',
                //     pid: row.Id,
                //   }),
                // )
              }}
              justIcon
              round
              color='primary'
              style={{ marginRight: 5 }}
            >
              <Edit />
            </Button>
          </Tooltip>
        </Table.Cell>
      )
    }
    return <Table.Cell {...props} />
  }

  render () {
    const { tableParas } = this.state
    // console.log(this.props)
    const { batches = [], dispatch } = this.props

    return (
      <CommonTableGrid2
        // height={500}
        rows={batches}
        {...tableParas}
      />
    )
  }
}

export default BatchList
