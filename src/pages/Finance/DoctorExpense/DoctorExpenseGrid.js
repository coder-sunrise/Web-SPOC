import React, { PureComponent } from 'react'
import { connect } from 'dva'
// material ui
import { Paper, withStyles } from '@material-ui/core'
import { Remove, Apps } from '@material-ui/icons'
// dev grid
import { Table } from '@devexpress/dx-react-grid-material-ui'
// custom components
import { Button, CommonTableGrid, Tooltip } from '@/components'

const styles = () => ({
  root: {},
  container: { marginTop: 5 },
})

const Cell = (props) => {
  const { column, onShowDetails, onConfirmDelete } = props

  if (column.name === 'Action') {
    return (
      <Table.Cell {...props}>
        <Tooltip title='View Details' placement='bottom-start'>
          <Button
            size='sm'
            onClick={onShowDetails}
            justIcon
            round
            color='primary'
            style={{ marginRight: 5 }}
          >
            <Apps />
          </Button>
        </Tooltip>
        <Tooltip title='Delete Doctor Expense' placement='bottom-start'>
          <Button
            size='sm'
            onClick={onConfirmDelete}
            justIcon
            round
            color='danger'
          >
            <Remove />
          </Button>
        </Tooltip>
      </Table.Cell>
    )
  }
  return <Table.Cell {...props} />
}

@connect(({ doctorExpense }) => ({ doctorExpense }))
class DoctorExpenseGrid extends PureComponent {
  state = {
    columns: [
      { name: 'doctor', title: 'Doctor' },
      { name: 'expenseDate', title: 'Date' },
      { name: 'expenseType', title: 'Type' },
      { name: 'expenseDescription', title: 'Description' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'expenseAmount', title: 'Amount' },
      { name: 'Action', title: '' },
    ],
    columnExtensions: [
      { columnName: 'expenseDate', type: 'date' },
      { columnName: 'expenseAmount', type: 'number', currency: true },
    ],
  }

  render () {
    const { columns, columnExtensions } = this.state
    const {
      doctorExpense: { list },
      dispatch,
      onShowDetails,
      onConfirmDelete,
    } = this.props
    const TableCell = (p) =>
      Cell({ ...p, dispatch, onShowDetails, onConfirmDelete })

    return (
      <Paper>
        <CommonTableGrid
          rows={list}
          columns={columns}
          columnExtensions={columnExtensions}
          ActionProps={{ TableCellComponent: TableCell }}
        />
      </Paper>
    )
  }
}

export default withStyles(styles)(DoctorExpenseGrid)
