import React, { PureComponent } from 'react'
import Edit from '@material-ui/icons/Edit'
// import { Table } from '@devexpress/dx-react-grid-material-ui'
import { status } from '@/utils/codes'
import { CommonTableGrid, Button } from '@/components'

class Grid extends PureComponent {
  configs = {
    rows: [
      {
        transNo: 'SA/000001',
        transDate: '01-02-2018',
        status: 'Draft',
        remarks: 'Remarks',
      },
      {
        transNo: 'SA/000002',
        transDate: '02-03-2018',
        status: 'Finalized',
        remarks: 'abc',
      },
      {
        transNo: 'SA/000003',
        transDate: '06-05-2018',
        status: 'Finalized',
        remarks: 'Need another adjustment',
      },
    ],
    columns: [
      { name: 'transNo', title: 'Transaction No' },
      { name: 'transDate', title: 'Transaction Date' },
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
          )
        },
      },
    ],
  }

  editRow = (row, e) => {
    const { dispatch, inventoryAdjustment } = this.props
    console.log('row', row)
    const { list } = inventoryAdjustment
    dispatch({
      type: 'inventoryAdjustment/updateState',
      payload: {
        showModal: true,
        entity: row,
        // entity: list.filter((o) => o.id === row.id),
      },
    })
  }

  render () {
    const { dispatch, classes, inventoryAdjustment, toggleModal } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        // type='inventoryAdjustment'
        onRowDoubleClick={this.editRow}
        {...this.configs}
      />
    )
  }
}

export default Grid
