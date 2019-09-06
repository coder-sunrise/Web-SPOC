import React, { PureComponent } from 'react'
import moment from 'moment'
import { CardContainer, CommonTableGrid, Button } from '@/components'
import Edit from '@material-ui/icons/Edit'

class Grid extends PureComponent {
  editRow = (row, e) => {}
  render () {
    return (
      <CardContainer hideHeader>
        <CommonTableGrid
          style={{ margin: 0 }}
          //type='deliveryOrder'
          rows={[
            {
              id: 1,
              doNo: 'PO/000001',
              doDate: moment(),
              total: 20,
              outstanding: 15,
              remarks: 'Will provide on 31 Jun 2018',
            },
            {
              id: 2,
              doNo: 'PO/000002',
              doDate: moment(),
              total: 50,
              outstanding: 0,
              remarks: 'Completed',
            },
            {
              id: 3,
              doNo: 'PO/000003',
              doDate: moment(),
              total: 20,
              outstanding: 15,
              remarks: 'Need Another Orders',
            },
            {
              id: 4,
              doNo: 'PO/000004',
              doDate: moment(),
              total: 20,
              outstanding: 15,
              remarks: 'Need Another Orders',
            },
            {
              id: 5,
              doNo: 'PO/000004',
              doDate: moment(),
              total: 20,
              outstanding: 15,
              remarks: 'Need Another Orders',
            },
          ]}
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
              columnName: 'total',
              type: 'number',
            },
            {
              columnName: 'outstanding',
              type: 'number',
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
