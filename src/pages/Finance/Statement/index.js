import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
// umi
import router from 'umi/router'
import { formatMessage } from 'umi/locale'
// formik
import { withFormik } from 'formik'
// material ui
import { Book, Pageview } from '@material-ui/icons'
import { Table } from '@devexpress/dx-react-grid-material-ui'
// custom components
import {
  Button,
  CommonHeader,
  CommonModal,
  CommonTableGrid,
  Tooltip,
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

@connect(({ corporateBilling }) => ({
  corporateBilling,
}))
@withFormik({ mapPropsToValues: () => ({}) })
class Statement extends PureComponent {
  state = {
    columns: [
      { name: 'patientRefNo', title: 'Patient Ref No.' },
      { name: 'patientName', title: 'Patient Name' },
      // { name: 'invoiceNo', title: 'Invoice No' },
      { name: 'amount', title: 'Amount' },
      { name: 'outstandingBalance', title: 'O/S Balance' },
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'action', title: 'Action' },
    ],
    columnExtensions: [
      { columName: 'amount', type: 'number', currency: true },
      { columName: 'outstandingBalance', type: 'number', currency: true },
      { columName: 'invoiceDate', type: 'date' },
    ],
    editingRowIds: [],
    rowChanges: {},
    rows: [
      {
        id: 'PT-000001A',
        patientRefNo: 'PT-000001A',
        patientName: 'Patient 01',
        invoiceNo: 'IV-000001',
        amount: 100,
        outstandingBalance: 100,
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
      },
      {
        id: 'PT-000005A',
        patientRefNo: 'PT-000005A',
        patientName: 'Patient 05',
        invoiceNo: 'IV-000005',
        amount: 10,
        outstandingBalance: 100,
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
      },
      {
        id: 'PT-000002A',
        patientRefNo: 'PT-000002A',
        patientName: 'Patient 02',
        invoiceNo: 'IV-000002',
        amount: 20,
        outstandingBalance: 100,
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
      },
      {
        id: 'PT-000003A',
        patientRefNo: 'PT-000003A',
        patientName: 'Patient 03',
        invoiceNo: 'IV-000003',
        amount: 130,
        outstandingBalance: 100,
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
      },
      {
        id: 'PT-000004A',
        patientRefNo: 'PT-000004A',
        patientName: 'Patient 04',
        invoiceNo: 'IV-000004',
        amount: 400,
        outstandingBalance: 100,
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
      },
    ],
    showAddNewStatement: false,
  }

  changeEditingRowIds = (editingRowIds) => this.setState({ editingRowIds })

  changeRowChanges = (rowChanges) => {
    this.setState({ rowChanges })
  }

  commitChanges = ({ changed }) => {
    const { rows } = this.state
    console.log('commitChanges', changed)
    // let updatedRows = []
    // if (changed) {
    //   updatedRows = rows.map(
    //     (row) => (changed[row.id] ? { ...row, ...changed[row.id] } : row),
    //   )
    // }

    // this.setState({
    //   rows: updatedRows,
    // })
  }

  handleSearch = (props) => {
    console.log('handleSearch', props)
  }

  handleShowDetails = (row) => {
    const { dispatch } = this.props
    const href = `/finance/statement/details/${row.id}`
    dispatch({
      type: 'menu/updateBreadcrumb',
      payload: {
        href,
        name: row.id,
      },
    })
    router.push(href)
  }

  toggleAddNewStatementModal = () => {
    const { showAddNewStatement } = this.state
    this.setState({ showAddNewStatement: !showAddNewStatement })
  }

  getActionProps = () => {
    const ActionCell = (p) =>
      Cell({
        ...p,
        onShowDetails: this.handleShowDetails,
      })

    return { TableCellComponent: ActionCell }
  }

  render () {
    const {
      rows,
      columns,
      columnExtensions,
      editingRowIds,
      rowChanges,
      showAddNewStatement,
    } = this.state

    const editingProps = {
      editingRowIds,
      rowChanges,
      onEditingRowIdsChange: this.changeEditingRowIds,
      onRowChangesChange: this.changeRowChanges,
      onCommitChanges: this.commitChanges,
      columnExtensions: [
        { columnName: 'patientRefNo', editingEnabled: false },
        { columnName: 'outstandingBalance', editingEnabled: false },
        { columnName: 'invoiceDate', editingEnabled: false },
        // { columnName: 'patientName', editingEnabled: false },
      ],
      availableColumns: {
        patientName: [
          { name: 'Patient 01', value: 'Patient 01' },
          { name: 'Patient 02', value: 'Patient 02' },
          { name: 'Patient 03', value: 'Patient 03' },
        ],
      },
    }

    const ActionProps = this.getActionProps()

    return (
      <CommonHeader Icon={<Book />} titleId='finance.statement.title'>
        {/* Testing EditableTableGrid reusable components
        <EditableTableGrid
          rows={rows}
          columns={columns}
          currencyColumns={currencyColumns}
          dateColumns={dateColumns}
          getRowId={getRowId}
          FuncProps={{ edit: false, filter: false }}
          ActionProps={ActionProps}
        />
        */}
        <SearchBar
          handleSearch={this.handleSearch}
          handleAddNew={this.toggleAddNewStatementModal}
        />
        <CommonTableGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          columnExtensions={columnExtensions}
          ActionProps={ActionProps}
        />
        <CommonModal
          open={showAddNewStatement}
          title={formatMessage({
            id: 'finance.statement.title.newStatement',
          })}
          onClose={this.toggleAddNewStatementModal}
          onConfirm={this.toggleAddNewStatementModal}
          maxWidth='lg'
          showFooter={false}
        >
          <AddNewStatement />
        </CommonModal>
      </CommonHeader>
    )
  }
}

export default Statement
