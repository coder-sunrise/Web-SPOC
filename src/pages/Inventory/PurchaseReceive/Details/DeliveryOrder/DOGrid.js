import React from 'react'
import Edit from '@material-ui/icons/Edit'
import { CardContainer, CommonTableGrid, Button } from '@/components'

const DOGrid = ({ onEditDeliveryOrderClicked, deliveryOrderDetails }) => {
  const { list } = deliveryOrderDetails
  const editRow = (row, e) => {
    onEditDeliveryOrderClicked(row)
  }
  return (
    <CommonTableGrid
      style={{ margin: 0 }}
      rows={list}
      onRowDoubleClick={editRow}
      columns={[
        { name: 'deliveryOrderDate', title: 'Delivery Order Date' },
        { name: 'deliveryOrderNo', title: 'Delivery Order No.' },
        { name: 'totalQty', title: 'Total Qty Received' },
        // { name: 'outstanding', title: 'Outstanding Qty' },
        { name: 'remark', title: 'Remarks' },
        {
          name: 'action',
          title: 'Action',
        },
      ]}
      columnExtensions={[
        {
          columnName: 'deliveryOrderDate',
          type: 'date',
        },
        {
          columnName: 'totalQty',
          type: 'number',
        },
        // {
        //   columnName: 'outstanding',
        //   type: 'number',
        // },
        {
          columnName: 'action',
          sortingEnabled: false,
          align: 'center',
          render: (row) => {
            return (
              <Button
                size='sm'
                authority='none'
                onClick={() => {
                  editRow(row)
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
  )
}

export default DOGrid
