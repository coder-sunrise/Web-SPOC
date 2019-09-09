import React, { PureComponent } from 'react'
import { CardContainer, CommonTableGrid, Button } from '@/components'
import Edit from '@material-ui/icons/Edit'

class Grid extends PureComponent {
  editRow = (row, e) => {}
  render () {
    return (
      <CardContainer hideHeader>
        <CommonTableGrid
          style={{ margin: 0 }}
          type='deliveryOrder'
          onRowDoubleClick={this.editRow}
          columns={[
            { name: 'doDate', title: 'Delivery Order Date' },
            { name: 'doNo', title: 'Delivery Order No.' },
            { name: 'total', title: 'Total Qty Received' },
            { name: 'outstanding', title: 'Outstanding Qty' },
            { name: 'remarks', title: 'Remarks' },
            {
              name: 'action',
              title: 'Action',
            },
          ]}
          // FuncProps={{ pager: false }}
          columnExtensions={[
            {
              columnName: 'doDate',
              type: 'date',
              format: 'DD MMM YYYY',
            },
            {
              columnName: 'action',
              sortingEnabled: false,
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
