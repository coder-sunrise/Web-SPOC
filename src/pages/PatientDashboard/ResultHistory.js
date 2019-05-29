import { CommonTableGrid2, Button } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Assignment from '@material-ui/icons/Assignment'

export default ({}) => (
  <CommonTableGrid2
    size='sm'
    rows={[
      {
        id: 1,
        name: 'Blood Glucose Level (mg/dL)',
      },
      {
        id: 2,
        name: 'Blood Pressure (Systolic) (mmHg)',
      },
      {
        id: 3,
        name: 'Memo',
        subject: 'Blood Pressure (Diastolic) (mmHg)',
      },
      {
        id: 4,
        name: 'Weight',
      },
      {
        id: 5,
        name: 'Heart Rate (bpm)',
      },
      {
        id: 6,
        name: 'HbA1c (%)',
      },
      {
        id: 7,
        name: 'Height',
      },
      {
        id: 8,
        name: 'Hypocount (mg/dL)',
      },
      {
        id: 9,
        name: 'Urine Alb/Creat Ratio (mg/mmol)',
      },
    ]}
    columns={[
      { name: 'name', title: 'Name' },
      { name: 'action', title: 'Action' },
    ]}
    FuncProps={{ pager: false }}
    columnExtensions={[]}
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
                <Assignment />
              </Button>
            </Table.Cell>
          )
        }
        return <Table.Cell {...props} />
      },
    }}
  />
)
