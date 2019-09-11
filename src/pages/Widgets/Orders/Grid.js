import React from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import {
  CommonTableGrid,
  Button,
  Popconfirm,
  Tooltip,
  NumberInput,
} from '@/components'
import { orderTypes } from '@/utils/codes'

export default ({ orders, dispatch }) => {
  const { rows } = orders

  const editRow = (row) => {
    dispatch({
      type: 'orders/updateState',
      payload: {
        entity: row,
        editType: row.editType,
        // adjustment: {
        //   adjValue: row.adjValue,
        //   adjAmount: row.adjAmount,
        //   adjType: row.adjType,
        // },
      },
    })
  }
  return (
    <CommonTableGrid
      size='sm'
      style={{ margin: 0 }}
      rows={rows}
      onRowDoubleClick={editRow}
      getRowId={(r) => r.uid}
      columns={[
        { name: 'editType', title: 'Type' },
        { name: 'subject', title: 'Name' },
        { name: 'remark', title: 'Description' },
        { name: 'adjAmount', title: 'Adj.' },
        { name: 'totalAfterOverallAdjustment', title: 'Total' },
        { name: 'action', title: 'Action' },
      ]}
      FuncProps={{ pager: false }}
      columnExtensions={[
        { columnName: 'editType', type: 'select', options: orderTypes },
        { columnName: 'adjAmount', type: 'currency' },
        {
          columnName: 'totalAfterOverallAdjustment',
          align: 'right',
          render: (r) => {
            if (!r.totalAfterItemAdjustment) return ''
            return (
              <NumberInput text currency value={r.totalAfterItemAdjustment} />
            )
          },
        },
        {
          columnName: 'remark',
          render: (r) => {
            return r.remark || r.remarks || ''
          },
        },
        {
          columnName: 'action',
          render: (row) => {
            return (
              <React.Fragment>
                <Button
                  size='sm'
                  onClick={() => {
                    editRow(row)
                  }}
                  justIcon
                  color='primary'
                  style={{ marginRight: 5 }}
                >
                  <Edit />
                </Button>
                <Popconfirm
                  onConfirm={() =>
                    dispatch({
                      type: 'orders/deleteRow',
                      payload: {
                        id: row.uid,
                      },
                    })}
                >
                  <Tooltip title='Delete'>
                    <Button size='sm' color='danger' justIcon>
                      <Delete />
                    </Button>
                  </Tooltip>
                </Popconfirm>
              </React.Fragment>
            )
          },
        },
      ]}
    />
  )
}
