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
        type: 'Medication',
        subject: 'Biogesic tab 500 mg',
        description: 'Take Twice A Day',
        total: 40,
      },
      {
        id: 2,
        type: 'Medication',
        subject: 'AMLODIPINE 5MG',
        description: 'Take Twice A Day',
        total: 40,
      },
      {
        id: 3,
        type: 'Medication',
        subject: 'Take Once A Day',
        description: 'Dr Levine',
        total: 40,
      },
      {
        id: 4,
        type: 'Vaccination',
        subject: 'ACTACEL Vaccine Injection (0.5 mL)',
        description: 'Vaccination Remarks',
        total: 40,
      },
      {
        id: 5,
        type: 'Service',
        subject: 'Consultation Service',
        description: '',
        total: 40,
      },
    ]}
    columns={[
      { name: 'type', title: 'Type' },
      { name: 'subject', title: 'Name' },
      { name: 'description', title: 'Description' },
      { name: 'total', title: 'Total' },

      { name: 'action', title: 'Action' },
    ]}
    FuncProps={{ pager: false }}
    columnExtensions={[
      { columnName: 'total', type: 'number', currency: true },
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
