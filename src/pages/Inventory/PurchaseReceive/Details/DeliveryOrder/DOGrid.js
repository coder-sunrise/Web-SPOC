import React from 'react'
import ListItem from '@material-ui/icons/List'
import { CommonTableGrid, Button } from '@/components'

const DOGrid = ({
  onEditDeliveryOrderClicked,
  deliveryOrderDetails,
  height,
}) => {
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
          columnName: 'action',
          sortingEnabled: false,
          align: 'center',
          render: row => {
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
                <ListItem />
              </Button>
            )
          },
        },
      ]}
      FuncProps={{
        pager: false,
      }}
      TableProps={{
        height,
      }}
    />
  )
}

export default DOGrid
