import React, { PureComponent } from 'react'
import { CardContainer, CommonTableGrid, Button } from '@/components'
import DeleteOutline from '@material-ui/icons/DeleteOutline'

class Grid extends PureComponent {
  deleteRow = (row, e) => {}
  render () {
    return (
      <CardContainer hideHeader>
        <CommonTableGrid
          style={{ margin: 0 }}
          type='purchaseReceivePayment'
          onRowDoubleClick={this.editRow}
          columns={[
            { name: 'paymentNo', title: 'Payment No.' },
            { name: 'paymentDate', title: 'Date' },
            { name: 'paymentMode', title: 'Payment Mode' },
            { name: 'reference', title: 'Reference' },
            { name: 'paymentAmount', title: 'Payment Amount' },
            { name: 'remarks', title: 'Remarks' },
            { name: 'action', title: 'Action' },
          ]}
          // FuncProps={{ pager: false }}
          columnExtensions={[
            {
              columnName: 'doDate',
              type: 'date',
              format: 'DD MMM YYYY',
            },
            { columnName: 'paymentAmount', type: 'number', currency: true },
            {
              columnName: 'action',
              sortingEnabled: false,
              align: 'center',
              render: (row) => {
                return (
                  <Button
                    size='sm'
                    onClick={() => {
                      this.deleteRow(row)
                    }}
                    justIcon
                    color='primary'
                  >
                    <DeleteOutline />
                  </Button>
                )
              },
            },
          ]}
          FuncProps={{
            pager: false,
          }}
        />
      </CardContainer>
    )
  }
}

export default Grid
