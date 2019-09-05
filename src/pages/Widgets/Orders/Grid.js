import { CommonTableGrid, Button,Popconfirm,Tooltip } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import { orderTypes } from '@/utils/codes'

export default ({ orders,dispatch }) => {
  const { rows } = orders

  const editRow =(row)=>{

    dispatch({
      type: 'orders/updateState',
      payload: {
        entity: row,
        editType:row.editType,
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
        { name: 'remarks', title: 'Description' },
        { name: 'total', title: 'Total' },
        { name: 'action', title: 'Action' },
      ]}
      FuncProps={{ pager: false }}
      columnExtensions={[
        { columnName: 'editType', type: 'select', options: orderTypes },

        { columnName: 'total', type: 'number', currency: true },
        { columnName: 'action', render:(row)=>{
          return (
            <>
              <Button
                size='sm'
                onClick={()=>{
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
                  <Button
                    size='sm'
                    color='danger'
                    justIcon
                  >
                    <Delete />
                  </Button>
                </Tooltip>
              </Popconfirm>
            </>
          )
        } },
      ]}
    />
  )
}
