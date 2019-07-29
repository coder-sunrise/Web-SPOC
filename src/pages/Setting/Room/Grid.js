import { CommonTableGrid2, Button } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { status } from '@/utils/codes'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import * as service from './services'

export default ({ dispatch, classes, settingRoom, toggleModal }) => {
  const editRow = async (row) => {
    const { list } = settingRoom
    // For complex object retrieve from server
    // dispatch({
    //   type: 'settingRoom/querySingle',
    //   payload: {
    //     id: row.id,
    //   },
    // }).then(toggleModal)

    dispatch({
      type: 'settingRoom/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }
  return (
    <CommonTableGrid2
      style={{ margin: 0 }}
      type='settingRoom'
      onRowDoubleClick={editRow}
      columns={[
        { name: 'code', title: 'Code' },
        { name: 'displayValue', title: 'Display Value' },
        { name: 'description', title: 'Description' },
        { name: 'isActive', title: 'Status' },
        { name: 'action', title: 'Action' },
      ]}
      // FuncProps={{ pager: false }}
      columnExtensions={[
        {
          columnName: 'isActive',
          sortingEnabled: false,
          type: 'select',
          options: status,
        },
      ]}
      ActionProps={{
        TableCellComponent: ({ column, row, ...props }) => {
          if (column.name === 'action') {
            return (
              <Table.Cell {...props}>
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
              </Table.Cell>
            )
          }
          return <Table.Cell {...props} />
        },
      }}
    />
  )
}
