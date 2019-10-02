import React, { PureComponent } from 'react'
import { Edit, Delete } from '@material-ui/icons'
import { CommonTableGrid, Button } from '@/components'

class Grid extends PureComponent {
  configs = {
    columns: [
      { name: 'transactionNo', title: 'Transaction No' },
      { name: 'transactionDate', title: 'Transaction Date' },
      { name: 'status', title: 'Status' },
      { name: 'remarks', title: 'Remark' },
      { name: 'action', title: 'Action' },
    ],
    columnExtensions: [
      {
        columnName: 'action',
        align: 'center',
        render: (row) => {
          return (
            <React.Fragment>
              <Button
                size='sm'
                onClick={() => {
                  this.editRow(row)
                }}
                justIcon
                color='primary'
              >
                <Edit />
              </Button>
              <Button
                size='sm'
                onClick={() => {
                  this.cancelRow(row)
                }}
                justIcon
                color='danger'
                disabled={row.status !== 'Draft'}
              >
                <Delete />
              </Button>
            </React.Fragment>
          )
        },
      },
      {
        columnName: 'transactionDate',
        type: 'date',
        format: 'd/M/YYYY',
        sortBy: 'adjustmentTransactionDate',
      },
      {
        columnName: 'transactionNo',
        sortBy: 'adjustmentTransactionNo',
      },
      {
        columnName: 'status',
        sortBy: 'inventoryAdjustmentStatusFK',
      },
    ],
  }

  editRow = async (row) => {
    const { dispatch, inventoryAdjustment } = this.props
    console.log('row', row)
    const { list } = inventoryAdjustment
    console.log('list', list)

    await this.props.dispatch({
      type: 'inventoryAdjustment/queryOne',
      payload: {
        id: row.id,
      },
    })

    dispatch({
      type: 'inventoryAdjustment/updateState',
      payload: {
        showModal: true,
      },
    })
  }

  cancelRow = (row) => {
    const { dispatch, inventoryAdjustment } = this.props

    this.props
      .dispatch({
        type: 'inventoryAdjustment/removeRow',
        payload: {
          id: row.id,
        },
      })
      .then(() => {
        this.props.dispatch({
          type: 'inventoryAdjustment/query',
        })
      })
  }

  render () {
    const { dispatch, classes, inventoryAdjustment, toggleModal } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='inventoryAdjustment'
        onRowDoubleClick={this.editRow}
        {...this.configs}
      />
    )
  }
}

export default Grid
