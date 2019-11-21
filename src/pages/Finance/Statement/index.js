import React, { PureComponent } from 'react'
import { connect } from 'dva'
// material ui
import { Print, Edit, Delete } from '@material-ui/icons'
// custom components
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  withStyles,
} from '@material-ui/core'
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
    open: false,
    selectedStatementNo: '',

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
    this.props.dispatch({
      type: 'statement/query',
      payload: {
        isCancelled: false,
      },
    })
  }

  handleSelectionChange = (selection) => {
    if (selection.length < 2) {
      this.setState({ selectedRows: selection })
    }
  }

  handleClickOpen = (row) => {
    this.setState((prevState) => {
      return {
        open: !prevState.open,
        selectedStatementNo: row.statementNo,
      }
    })
  }

  confirmDelete = () => {
    this.setState((prevState) => {
      return { open: !prevState.open }
    })

    const { dispatch, statement } = this.props
    const rowId = statement.entity.list.find(
      (o) => o.statementNo === this.state.selectedStatementNo,
    ).id

    dispatch({
      type: 'statement/removeRow',
      payload: {
        id: rowId,
        cancelReason: 'Statement Cancelled',
      },
    }).then(() => {
      this.props.dispatch({
        type: 'statement/query',
      })
    })
  }

  handleClose = (e) => {
    this.setState((prevState) => {
      return { open: !prevState.open }
    })
  }

  render () {
    // console.log('rows', this.state.rows)

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
    const { rows, columns, selectedStatementNo } = this.state
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
            },
            {
              columnName: 'statementDate',
              type: 'date',
              format: { dateFormatLong },
              width: 120,
            },
            {
              columnName: 'dueDate',
              type: 'date',
              format: { dateFormatLong },
              sortBy: 'DueDate',
              width: 120,
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
                            this.handleClickOpen(row)
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
        <Dialog
          open={this.state.open}
          // onClose={this.handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>Are you sure?</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Cancel this statement - <b>{selectedStatementNo}</b> ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} value='false' color='danger'>
              No
            </Button>
            <Button
              onClick={this.confirmDelete}
              value='true'
              color='primary'
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </CardContainer>
    )
  }
}

export default withStyles(styles)(Statement)
