import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
// umi
import router from 'umi/router'
import { formatMessage } from 'umi/locale'
// formik
import { withFormik } from 'formik'
// material ui
import { Book, Pageview, Edit, Delete } from '@material-ui/icons'
import { Table } from '@devexpress/dx-react-grid-material-ui'
// custom components
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
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
import AddNewStatement from './NewStatement/AddNewStatement'

const getRowId = (row) => row.id

const Cell = (props) => {
  const { column, row, onShowDetails, ...restProps } = props
  const invokeOnShowDetails = () => onShowDetails(row)
  if (column.name === 'action') {
    return (
      <Table.Cell {...restProps}>
        <Tooltip title='View Statement Details'>
          <Button
            size='sm'
            onClick={invokeOnShowDetails}
            justIcon
            round
            color='primary'
            style={{ marginRight: 5 }}
          >
            <Pageview />
          </Button>
        </Tooltip>
      </Table.Cell>
    )
  }
  return <Table.Cell {...restProps} />
}

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
    // rows: [
    //   {
    //     id: 'SM/00001',
    //     statementNo: 'SM/00001',
    //     statementDate: '2019-08-14 09:50:59',
    //     // moment()
    //     //   .add(Math.ceil(Math.random() * 100) - 100, 'days')
    //     //   .format('LLL'),
    //     company: 'Prudential',
    //     payableAmount: '100',
    //     paid: '20',
    //     outstanding: 180,
    //     dueDate: '2019-09-14 09:50:59',
    //     remarks: 'Remarks for this statement',
    //   },
    //   {
    //     id: 'SM/00002',
    //     statementNo: 'SM/00002',
    //     statementDate: moment()
    //       .add(Math.ceil(Math.random() * 100) - 100, 'days')
    //       .format('LLL'),
    //     company: 'AVIVA',
    //     payableAmount: 200,
    //     paid: 200,
    //     outstanding: 0,
    //     dueDate: moment()
    //       .add(Math.ceil(Math.random() * 100) - 100, 'days')
    //       .format('LLL'),
    //     remarks: '',
    //   },
    // ],
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

  // editRow = (row, e) => {
  //   const { dispatch, corporateBilling } = this.props

  //   const { list } = corporateBilling

  //   dispatch({
  //     type: 'corporateBilling/updateState',
  //     payload: {
  //       showModal: true,
  //       entity: list.find((o) => o.id === row.id),
  //     },
  //   })
  // }

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
    const { rows, columns } = this.state
    return (
      <Authorized authority='statement.statementdetails'>
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
            selection={this.state.selectedRows}
            onSelectionChange={this.handleSelectionChange}
            onRowDoubleClick={editRow}
            rows={rows}
            columns={columns}
            FuncProps={{ selectable: true }}
            columnExtensions={[
              {
                columnName: 'company',
                sortBy: 'CopayerFKNavigation.displayValue',
              },
              {
                columnName: 'payableAmount',
                type: 'number',
                currency: true,
                sortBy: 'totalAmount',
              },
              {
                columnName: 'totalPaid',
                type: 'number',
                currency: true,
                sortBy: 'CollectedAmount',
              },
              {
                columnName: 'outstandingAmount',
                type: 'number',
                currency: true,
              },
              {
                columnName: 'statementDate',
                type: 'date',
                format: { dateFormatLong },
              },
              {
                columnName: 'dueDate',
                type: 'date',
                format: { dateFormatLong },
                sortBy: 'DueDate',
              },
              {
                columnName: 'action',
                align: 'center',
                render: (row) => {
                  return (
                    <React.Fragment>
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
                      <Button
                        size='sm'
                        onClick={() => {
                          this.handleClickOpen(row)
                        }}
                        justIcon
                        color='primary'
                      >
                        <Delete />
                      </Button>
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
                Cancel this statement - <b>{this.state.selectedStatementNo}</b>{' '}
                ?
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
      </Authorized>
    )
  }
}

// state = {
//   columns: [
//     { name: 'statementNo', title: 'Statement No.' },
//     { name: 'statementDate', title: 'Statement Date' },
//     { name: 'company', title: 'Company' },
//     { name: 'payableAmount', title: 'Payable Amount' },
//     { name: 'paid', title: 'Paid' },
//     { name: 'outstanding', title: 'Outstanding' },
//     { name: 'dueDate', title: 'Due Date' },
//     { name: 'remarks', title: 'Remarks' },
//     { name: 'action', title: 'Action' },
//   ],
//   columnExtensions: [
//     { columName: 'statementDate', type: 'date', format: 'DD MMM YYYY' },
//     { columName: 'paid', type: 'currency', currency: true },
//     { columName: 'outstanding', type: 'currency', currency: true },
//     { columName: 'dueDate', type: 'date', format: 'DD MMM YYYY' },
//   ],
//   editingRowIds: [],
//   rowChanges: {},
//   rows: [
//     {
//       id: 'SM/00001',
//       statementNo: 'SM/00001',
//       statementDate: moment()
//         .add(Math.ceil(Math.random() * 100) - 100, 'days')
//         .format('LLL'),
//       company: 'Prudential',
//       payableAmount: 100,
//       paid: 20,
//       outstanding: 180,
//       dueDate: moment()
//         .add(Math.ceil(Math.random() * 100) - 100, 'days')
//         .format('LLL'),
//       remarks: 'Remarks for this statement',
//     },
//     {
//       id: 'SM/00002',
//       statementNo: 'SM/00002',
//       statementDate: moment()
//         .add(Math.ceil(Math.random() * 100) - 100, 'days')
//         .format('LLL'),
//       company: 'AVIVA',
//       payableAmount: 200,
//       paid: 200,
//       outstanding: 0,
//       dueDate: moment()
//         .add(Math.ceil(Math.random() * 100) - 100, 'days')
//         .format('LLL'),
//       remarks: '',
//     },
//   ],
//   showAddNewStatement: false,
// }

// changeEditingRowIds = (editingRowIds) => this.setState({ editingRowIds })

// changeRowChanges = (rowChanges) => {
//   this.setState({ rowChanges })
// }

// commitChanges = ({ changed }) => {
//   const { rows } = this.state
//   console.log('commitChanges', changed)
//   // let updatedRows = []
//   // if (changed) {
//   //   updatedRows = rows.map(
//   //     (row) => (changed[row.id] ? { ...row, ...changed[row.id] } : row),
//   //   )
//   // }

//   // this.setState({
//   //   rows: updatedRows,
//   // })
// }

// handleSearch = (props) => {
//   console.log('handleSearch', props)
// }

// handleShowDetails = (row) => {
//   const { dispatch } = this.props
//   const href = `/finance/statement/details/${row.id}`
//   dispatch({
//     type: 'menu/updateBreadcrumb',
//     payload: {
//       href,
//       name: row.id,
//     },
//   })
//   router.push(href)
// }

// toggleAddNewStatementModal = () => {
//   const { showAddNewStatement } = this.state
//   this.setState({ showAddNewStatement: !showAddNewStatement })
// }

// getActionProps = () => {
//   const ActionCell = (p) =>
//     Cell({
//       ...p,
//       onShowDetails: this.handleShowDetails,
//     })

//   return { TableCellComponent: ActionCell }
// }

// render () {
//   const {
//     rows,
//     columns,
//     columnExtensions,
//     editingRowIds,
//     rowChanges,
//     showAddNewStatement,
//   } = this.state

//   const editingProps = {
//     editingRowIds,
//     rowChanges,
//     onEditingRowIdsChange: this.changeEditingRowIds,
//     onRowChangesChange: this.changeRowChanges,
//     onCommitChanges: this.commitChanges,
//     columnExtensions: [
//       { columnName: 'patientRefNo', editingEnabled: false },
//       { columnName: 'outstandingBalance', editingEnabled: false },
//       { columnName: 'invoiceDate', editingEnabled: false },
//       // { columnName: 'patientName', editingEnabled: false },
//     ],
//     availableColumns: {
//       patientName: [
//         { name: 'Patient 01', value: 'Patient 01' },
//         { name: 'Patient 02', value: 'Patient 02' },
//         { name: 'Patient 03', value: 'Patient 03' },
//       ],
//     },
//   }

//   const ActionProps = this.getActionProps()
//   const { history } = this.props
//   return (
//     <CommonHeader Icon={<Book />} titleId='finance.statement.title'>
//       {/* Testing EditableTableGrid reusable components
//       <EditableTableGrid
//         rows={rows}
//         columns={columns}
//         currencyColumns={currencyColumns}
//         dateColumns={dateColumns}
//         getRowId={getRowId}
//         FuncProps={{ edit: false, filter: false }}
//         ActionProps={ActionProps}
//       />
//       */}
//       <SearchBar
//         history={history}
//         handleSearch={this.handleSearch}
//         handleAddNew={this.toggleAddNewStatementModal}
//       />
//       <CommonTableGrid
//         rows={rows}
//         columns={columns}
//         getRowId={getRowId}
//         columnExtensions={columnExtensions}
//         ActionProps={ActionProps}
//       />
//       {/* <CommonModal
//         open={showAddNewStatement}
//         title={formatMessage({
//           id: 'finance.statement.title.newStatement',
//         })}
//         onClose={this.toggleAddNewStatementModal}
//         onConfirm={this.toggleAddNewStatementModal}
//         maxWidth='lg'
//         showFooter={false}
//       >
//         <AddNewStatement />
//       </CommonModal> */}
//     </CommonHeader>
//     )
//   }
// }

export default Statement
