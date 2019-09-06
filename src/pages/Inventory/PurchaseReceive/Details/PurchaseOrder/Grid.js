import React, { PureComponent } from 'react'
import { CommonTableGrid } from '@/components'
import DeleteOutline from '@material-ui/icons/DeleteOutline'

class Grid extends PureComponent {
  deleteRow = (row, e) => {}
  render () {
    return (
      <React.Fragment>
        <CommonTableGrid
          style={{ margin: 0 }}
          type='purchaseReceivePayment'
          onRowDoubleClick={this.editRow}
          columns={[
            { name: 'type', title: 'Type' },
            { name: 'code', title: 'Code' },
            { name: 'name', title: 'Name' },
            { name: 'uom', title: 'UOM' },
            { name: 'orderQty', title: 'Order Qty' },
            { name: 'bonusQty', title: 'Bonus Qty' },
            { name: 'totalQty', title: 'Total Qty' },
            { name: 'totalReceived', title: 'Total Received' },
            { name: 'totalPrice', title: 'Total Price' },
          ]}
          // FuncProps={{ pager: false }}
          columnExtensions={[
            {
              columnName: 'orderQty',
              type: 'number',
            },
            {
              columnName: 'bonusQty',
              type: 'number',
            },
            {
              columnName: 'totalQty',
              type: 'number',
            },
            {
              columnName: 'totalReceived',
              type: 'number',
            },
            {
              columnName: 'totalPrice',
              type: 'number',
              currency: true,
            },
          ]}
          FuncProps={{
            pager: false,
          }}
        />
      </React.Fragment>
    )
  }
}

export default Grid
