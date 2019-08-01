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
        type: 'PH0001',
        displayValue: 'New Year',
        description: 'New Year',
        startDate: '1 January 2020',
        endDate: '1 January 2020',
        effectiveStartDate: '1 January 2020',
        effectiveEndDate: '1 January 2020',
      },
      {
        id: 2,
        type: 'PH0002',
        displayValue: 'Christmas Day',
        description: 'Christmas Day',
        startDate: '25 December 2020',
        endDate: '25 December 2020',
        effectiveStartDate: '1 January 2020',
        effectiveEndDate: '31 December 2020',
      },
    ]}
    columns={[
      { name: 'type', title: 'Code' },
      { name: 'displayValue', title: 'Display Value' },
      { name: 'description', title: 'Description' },
      { name: 'startDate', title: 'Start Date' },
      { name: 'endDate', title: 'End Date' },
      { name: 'effectiveStartDate', title: 'Effective Start Date' },
      { name: 'effectiveEndDate', title: 'Effective End Date' },
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
