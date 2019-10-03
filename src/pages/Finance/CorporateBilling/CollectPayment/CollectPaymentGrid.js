import React, { PureComponent } from 'react'
import { connect } from 'dva'
import numeral from 'numeral'
import { Paper } from '@material-ui/core'
import {
  FilteringState,
  EditingState,
  IntegratedSelection,
  IntegratedSorting,
  PagingState,
  SelectionState,
  SortingState,
  DataTypeProvider,
} from '@devexpress/dx-react-grid'
import {
  Grid as DevGrid,
  Table,
  TableEditRow,
  TableEditColumn,
  TableHeaderRow,
  TableSelection,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui'

import { Getter } from '@devexpress/dx-react-core'
import { NumberInput, CommonTableGrid } from '@/components'

import { NumberFormatter } from '@/utils/utils'
import CommandComponent from './CommandComponent'

const numberOnChangeFormatter = (onChangeEvent) => (value) =>
  onChangeEvent(numeral(value)._value)

const NumberEditor = (props) => {
  const {
    column: { nonEditable = true },
    paras,
    value,
    onValueChange,
    classes,
    ...restProps
  } = props
  return !nonEditable ? (
    <NumberInput
      value={value}
      onChange={(event) =>
        numberOnChangeFormatter(onValueChange)(event.target.value)}
      currency
      simple
    />
  ) : (
    <Table.Cell {...props} />
  )
}

const NumberTypeProvider = (props) => {
  // console.log(props)
  return (
    <DataTypeProvider
      formatterComponent={NumberFormatter}
      editorComponent={NumberEditor}
      {...props}
    />
  )
}

const EditCell = (props) => {
  // return <EditingCell {...props} />
  const { editingEnabled } = props
  return !editingEnabled ? (
    <Table.Cell {...props} />
  ) : (
    <TableEditRow.Cell {...props} />
  )
}

const getRowId = (row) => row.id

@connect(({ corporateBilling }) => ({
  corporateBilling,
}))
class CollectPaymentGrid extends PureComponent {
  state = {
    columns: [
      { name: 'patientRefNo', title: 'Patient Ref No.' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'invoiceNo', title: 'Invoice No' },
      { name: 'copay', title: 'Co-Pay' },
      { name: 'amount', title: 'Amount' },
      { name: 'outstandingBalance', title: 'O/S Balance' },
      { name: 'payAmount', title: 'Pay Amount', nonEditable: false },
      { name: 'balance', title: 'Balance' },
    ],
    columnExtensions: [
      { columnName: 'amount', type: 'number', currency: true },
      { columnName: 'outstandingBalance', type: 'number', currency: true },
      { columnName: 'payAmount', type: 'number', currency: true },
      { columnName: 'balance', type: 'number', currency: true },
    ],
    selectedRows: [],
  }

  changeEditingRowIds = (editingRowIds) => this.setState({ editingRowIds })

  changeRowChanges = (rowChanges) => this.setState({ rowChanges })

  commitChanges = ({ changed }) => {
    const { corporateBilling: { collectPaymentList }, dispatch } = this.props
    let updatedRows = []
    if (changed) {
      updatedRows = collectPaymentList.map(
        (collectPaymentRow) =>
          changed[collectPaymentRow.id]
            ? { ...collectPaymentRow, ...changed[collectPaymentRow.id] }
            : collectPaymentRow,
      )
    }
    dispatch({
      type: 'corporateBilling/updateCollectPaymentList',
      payload: updatedRows,
    })
  }

  getEditingStateColExt = () => {
    const { columns } = this.state

    return columns.map((col) => ({
      columnName: col.name,
      editingEnabled: col.name === 'payAmount',
    }))
  }

  handleSelectionChange = (rows) => {
    const { selectedRows } = this.state
    const {
      onTotalAmountChanges,
      corporateBilling: { collectPaymentList },
    } = this.props

    const getSum = (sum, payment) => sum + payment.amount
    const totalAmount = collectPaymentList
      .filter((item) => rows.includes(item.id))
      .reduce(getSum, 0)
    this.setState({
      selectedRows: [
        ...rows,
      ],
    })
    onTotalAmountChanges(totalAmount)
  }

  render () {
    const { columns, columnExtensions, selectedRows } = this.state
    const { corporateBilling: { collectPaymentList } } = this.props
    // const TableCell = (p) => Cell({ ...p })
    const editingStateColumnExtensions = this.getEditingStateColExt()
    return (
      <CommonTableGrid
        height={400}
        rows={collectPaymentList}
        columns={columns}
        getRowId={getRowId}
        FuncProps={{ pager: false, selectable: true }}
        columnExtensions={columnExtensions}
        selection={selectedRows}
        onSelectionChange={this.handleSelectionChange}
      />
    )
  }
}

export default CollectPaymentGrid
