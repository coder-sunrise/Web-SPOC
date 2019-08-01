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
        doctorName: 'Dr Levine',
        startDate: '12 Jun 2019',
        startTime: '09:00AM',
        endDate: '12 Jun 2019',
        endTime: '06:00PM',
        recurrence: 'Weekly',
        remarks: 'Family Day',
        status: 'Active',
      },
      {
        id: 2,
        doctorName: 'Dr Charles',
        startDate: '3 Aug 2019',
        startTime: '09:00AM',
        endDate: '3 Aug 2019',
        endTime: '04:00PM',
        recurrence: 'Monthly',
        remarks: 'Time Off',
        status: 'Active',
      },
    ]}
    columns={[
      { name: 'doctorName', title: 'Doctor Name' },
      { name: 'startDate', title: 'Start Date' },
      { name: 'startTime', title: 'Start Time' },
      { name: 'endDate', title: 'End Date' },
      { name: 'endTime', title: 'End Time' },
      { name: 'recurrence', title: 'Recurrence' },
      { name: 'remarks', title: 'Remarks' },
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
