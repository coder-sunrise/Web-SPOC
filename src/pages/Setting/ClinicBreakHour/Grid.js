import { CommonTableGrid, Button } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'

export default ({ dispatch, classes }) => (
  <CommonTableGrid
    style={{ margin: 0 }}
    rows={[
      {
        clinicName: 'Ang Mo Kio Ave 1',
        displayValue: 'BH001',
        code: 'Break Hour',
        status: 'Active',
        mondayTiming: '12:00 - 13:00',
        tuesdayTiming: '12:00 - 13:00',
        wednesdayTiming: '12:00 - 13:00',
        thurdayTiming: '12:00 - 13:00',
        fridayTiming: '12:00 - 13:00',
        saturdayTiming: '12:00 - 13:00',
        sundayTiming: '12:00 - 13:00',
      },
    ]}
    columns={[
      { name: 'clinicName', title: 'Clinic' },
      { name: 'displayValue', title: 'Display Value' },
      { name: 'code', title: 'Code' },
      { name: 'status', title: 'Status' },
      { name: 'mondayTiming', title: 'Monday' },
      { name: 'tuesdayTiming', title: 'Tuesday' },
      { name: 'wednesdayTiming', title: 'Wednesday' },
      { name: 'thurdayTiming', title: 'Thursday' },
      { name: 'fridayTiming', title: 'Friday' },
      { name: 'saturdayTiming', title: 'Saturday' },
      { name: 'sundayTiming', title: 'Sunday' },
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
