import React, { PureComponent } from 'react'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'

import {
  CommonTableGrid,
  Button,
  dateFormatLong,
  Popconfirm,
  notification,
} from '@/components'
import { AuthorizationWrapper } from '@/components/_medisys'
import Authorized from '@/utils/Authorized'

class Grid extends PureComponent {
  configs = {
    columns: [
      { name: 'transactionNo', title: 'Transaction No' },
      { name: 'transactionDate', title: 'Transaction Date' },
      { name: 'status', title: 'Status' },
      { name: 'remarks', title: 'Remarks' },
      { name: 'action', title: 'Action' },
    ],
    columnExtensions: [
      {
        columnName: 'action',
        align: 'center',
        render: (row) => {
          return (
            <React.Fragment>
              <AuthorizationWrapper authority='inventoryadjustment.inventoryadjustmentdetails'>
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
                <Popconfirm
                  title='Are you sure?'
                  onConfirm={() => {
                    setTimeout(() => {
                      this.cancelRow(row)
                    }, 1)
                  }}
                >
                  <Button
                    size='sm'
                    justIcon
                    color='danger'
                    disabled={row.status !== 'Draft'}
                  >
                    <Delete />
                  </Button>
                </Popconfirm>
              </AuthorizationWrapper>
            </React.Fragment>
          )
        },
      },
      {
        columnName: 'transactionDate',
        type: 'date',
        format: dateFormatLong,
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
      {
        columnName: 'remarks',
        width: 350,
      },
    ],
  }

  editRow = async (row) => {
    const { dispatch, inventoryAdjustment, toggleModal } = this.props
    const accessRight = Authorized.check(
      'inventoryadjustment.inventoryadjustmentdetails',
    )
    if (!accessRight || (accessRight && accessRight.rights !== 'enable')) {
      notification.error({
        message: 'Current user is not authorized to access',
      })
      return
    }

    await this.props
      .dispatch({
        type: 'inventoryAdjustment/queryOne',
        payload: {
          id: row.id,
        },
      })
      .then(() => {
        toggleModal()
        // dispatch({
        //   type: 'inventoryAdjustment/updateState',
        //   payload: {
        //     showModal: true,
        //   },
        // })
      })
  }

  cancelRow = (row) => {
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
