import { CommonTableGrid2, Button } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'

export default ({ dispatch, classes }) => (
  <CommonTableGrid2
    style={{ margin: 0 }}
    rows={[
      {
        id: 1,
        type: 'SV/000001',
        displayValue: 'Surgery - Minor Procedure',
        description: 'Surgery - Minor Procedure',
        serviceCenter: 'Doctor Consultation',
        status: 'Active',
        sellingPrice: 40,
      },
    ]}
    columns={[
      { name: 'type', title: 'Code' },
      { name: 'displayValue', title: 'Display Value' },
      { name: 'description', title: 'Description' },
      { name: 'serviceCenter', title: 'Service Center' },
      { name: 'sellingPrice', title: 'Unit Selling Price' },
      { name: 'status', title: 'Status' },
      { name: 'action', title: 'Action' },
    ]}
    FuncProps={{ pager: false }}
    columnExtensions={[
      { columnName: 'sellingPrice', type: 'number', currency: true },
    ]}
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
