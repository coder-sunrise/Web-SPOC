import { CommonTableGrid, Button } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'

export default ({ dispatch, classes }) => (
  <CommonTableGrid
    style={{ margin: 0 }}
    rows={[
      {
        id: 1,
        code: 'R/000001',
        displayValue: 'Nurse',
        description: 'Nurse',
        status: 'Active',
      },
      {
        id: 2,
        code: 'R/000002',
        displayValue: 'Doctor',
        description: 'Doctor',
        status: 'Active',
      },
    ]}
    columns={[
      { name: 'code', title: 'Code' },
      { name: 'displayValue', title: 'Display Value' },
      { name: 'description', title: 'Description' },
      { name: 'status', title: 'Status' },
      { name: 'action', title: 'Action' },
    ]}
    FuncProps={{ pager: false }}
    ActionProps={{
      TableCellComponent: ({ column, row, ...props }) => {
        if (column.name === 'action') {
          return (
            <Table.Cell {...props}>
              <Button
                size='sm'
                onClick={() => {
                  // props.history.push(
                  //   getAppendUrl({
                  //     md: 'pt',
                  //     cmt: '1',
                  //     pid: row.id,
                  //   }),
                  // )
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
