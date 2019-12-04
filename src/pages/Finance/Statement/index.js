import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
// material ui
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import Print from '@material-ui/icons/Print'

// custom components
import { withStyles } from '@material-ui/core'
import Authorized from '@/utils/Authorized'
import {
  Button,
  CommonTableGrid,
  Tooltip,
  dateFormatLong,
  CardContainer,
} from '@/components'
// sub components
import SearchBar from './SearchBar'
import PrintStatementReport from './PrintStatementReport'

const styles = () => ({})

@connect(({ statement }) => ({
  statement,
}))
class Statement extends PureComponent {
  state = {
    selectedRows: [],
    columns: [
      { name: 'statementNo', title: 'Statement No.' },
      { name: 'statementDate', title: 'Statement Date' },
      { name: 'company', title: 'Company' },
      { name: 'payableAmount', title: 'Payable Amount' },
      { name: 'totalPaid', title: 'Paid' },
      { name: 'outstandingAmount', title: 'Outstanding' },
      { name: 'dueDate', title: 'Due Date' },
      { name: 'remark', title: 'Remarks' },
      { name: 'action', title: 'Action' },
    ],
  }

  componentDidMount () {
    const fromDate = moment().subtract(1, 'months').startOf('month').formatUTC()
    const toDate = moment().endOf('month').formatUTC(false)
    this.props.dispatch({
      type: 'statement/query',
      payload: {
        isCancelled: false,
        lgteql_statementDate: fromDate,
        lsteql_statementDate: toDate,
        apiCriteria: {
          DueDateFrom: fromDate,
          DueDateTo: toDate,
        },
      },
    })
  }

  handleSelectionChange = (selection) => {
    if (selection.length < 2) {
      this.setState({ selectedRows: selection })
    }
  }

  cancelStatement = (row) => {
    const { dispatch } = this.props
    const { statementNo, id } = row
    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmContent: `Are you sure want to delete record ${statementNo} ?`,
        onConfirmDiscard: () => {
          dispatch({
            type: 'statement/removeRow',
            payload: {
              id,
              cancelReason: 'Statement Cancelled',
            },
          }).then(() => {
            this.props.dispatch({
              type: 'statement/query',
            })
          })
        },
      },
    })
  }

  render () {
    const { history, dispatch } = this.props
    const editRow = (row, e) => {
      dispatch({
        type: 'statement/updateState',
        payload: {
          currentId: row.id,
        },
      })
      history.push(`/finance/statement/details/${row.id}`)
    }
    const { rows, columns } = this.state
    return (
      <CardContainer hideHeader>
        <SearchBar
          history={history}
          handleSearch={this.handleSearch}
          handleAddNew={this.toggleAddNewStatementModal}
          dispatch={dispatch}
          selectedRows={this.state.selectedRows}
        />
        <CommonTableGrid
          style={{ margin: 0 }}
          type='statement'
          // selection={this.state.selectedRows}
          // onSelectionChange={this.handleSelectionChange}
          onRowDoubleClick={editRow}
          rows={rows}
          columns={columns}
          // FuncProps={{ selectable: true }}
          columnExtensions={[
            {
              columnName: 'statementNo',
              width: 130,
            },
            {
              columnName: 'company',
              sortBy: 'CopayerFKNavigation.displayValue',
            },
            {
              columnName: 'payableAmount',
              type: 'number',
              currency: true,
              sortBy: 'totalAmount',
              width: 130,
            },
            {
              columnName: 'totalPaid',
              type: 'number',
              currency: true,
              sortBy: 'CollectedAmount',
              width: 130,
            },
            {
              columnName: 'outstandingAmount',
              type: 'number',
              currency: true,
              width: 130,
              sortingEnabled: false,
            },
            {
              columnName: 'statementDate',
              type: 'date',
              format: dateFormatLong,
              width: 120,
            },
            {
              columnName: 'dueDate',
              type: 'date',
              format: dateFormatLong,
              sortBy: 'DueDate',
              width: 120,
              sortingEnabled: false,
            },
            {
              columnName: 'action',
              align: 'center',
              width: 130,
              render: (row) => {
                return (
                  <React.Fragment>
                    <Authorized authority='statement.statementdetails'>
                      <Tooltip title='Edit Statement'>
                        <Button
                          size='sm'
                          onClick={() => {
                            editRow(row)
                          }}
                          justIcon
                          color='primary'
                        >
                          <Edit />
                        </Button>
                      </Tooltip>
                      <Tooltip title='Delete Statement'>
                        <Button
                          size='sm'
                          onClick={() => {
                            this.cancelStatement(row)
                          }}
                          justIcon
                          color='danger'
                        >
                          <Delete />
                        </Button>
                      </Tooltip>
                      <PrintStatementReport id={row ? row.id : null}>
                        <Tooltip title='Print Statement'>
                          <Button size='sm' justIcon color='primary'>
                            <Print />
                          </Button>
                        </Tooltip>
                      </PrintStatementReport>
                    </Authorized>
                  </React.Fragment>
                )
              },
            },
          ]}
        />
      </CardContainer>
    )
  }
}

export default withStyles(styles)(Statement)
