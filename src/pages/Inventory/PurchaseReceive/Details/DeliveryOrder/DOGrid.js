import React from 'react'
import { CardContainer, CommonTableGrid, Button } from '@/components'
import Edit from '@material-ui/icons/Edit'

const DOGrid = ({ onEditDeliveryOrderClicked, deliveryOrderDetails }) => {
  const { list } = deliveryOrderDetails
  list.map((x) => {
    x.total = 0
    x.outstanding = 0
    return x
  })

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
        { name: 'total', title: 'Total Qty Received' },
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
          columnName: 'total',
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
