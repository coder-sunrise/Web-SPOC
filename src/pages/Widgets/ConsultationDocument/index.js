import { CommonTableGrid2, Button } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'

export default ({}) => (
  <CommonTableGrid2
    size='sm'
    style={{ margin: 0 }}
    rows={[
      {
        id: 1,
        type: 'Referral Letter',
        subject: 'Referral Letter To Dr Ong',
        from: 'Dr Johnny',
      },
      {
        id: 2,
        type: 'Others',
        subject: 'Vaccination Certificate',
        from: 'Dr Levine',
      },
      {
        id: 3,
        type: 'Memo',
        subject: 'Patient Visit Reminder',
        from: 'Dr Levine',
      },
      {
        id: 4,
        type: 'Medical Certificate',
        subject: '09 May 2019 - 09 May 2019 - 1 Day(s)',
        from: 'Dr Levine',
      },
      {
        id: 5,
        type: 'Certificate of Attendance',
        subject: '09 May 2019 - 09 May 2019 - 1 Day',
        from: 'Dr Levine',
      },
    ]}
    columns={[
      { name: 'type', title: 'Type' },
      { name: 'subject', title: 'Subject' },
      { name: 'from', title: 'From' },
      { name: 'action', title: 'Action' },
    ]}
    FuncProps={{ pager: false }}
    columnExtensions={[
      { columnName: 'subject', type: 'link', linkField: 'href' },
    ]}
    ActionProps={{
      TableCellComponent: ({
        column,
        row,
        dispatch,
        classes,
        renderActionFn,
        ...props
      }) => {
        // console.log(this)
        if (column.name === 'action') {
          return (
            <Table.Cell {...props}>
              <Button
                size='sm'
                onClick={() => {
                  // props.history.push(
                  //   getAppendUrl({
                  //     md: 'pt',
                  //     cmt: 'dmgp',
                  //     pid: row.id,
                  //   }),
                  // )
                }}
                justIcon
                round
                color='primary'
                style={{ marginRight: 5 }}
              >
                <Edit />
              </Button>
              <Button
                size='sm'
                onClick={() => {
                  // props.history.push(
                  //   getAppendUrl({
                  //     md: 'pt',
                  //     cmt: 'dmgp',
                  //     pid: row.id,
                  //   }),
                  // )
                }}
                justIcon
                round
                color='primary'
              >
                <Delete />
              </Button>
            </Table.Cell>
          )
        }
        return <Table.Cell {...props} />
      },
    }}
  />
)
