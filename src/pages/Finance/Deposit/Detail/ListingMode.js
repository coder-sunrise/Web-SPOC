import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { Payment } from '@material-ui/icons'

import { Button, EditableTableGrid } from '@/components'

const Cell = (props) => {
  const { column } = props
  if (column.name === 'Action') {
    return (
      <Table.Cell {...props}>
        <Button
          size='sm'
          onClick={() => {}}
          justIcon
          round
          color='primary'
          title='Collect Payments'
          style={{ marginRight: 5 }}
        >
          <Payment />
        </Button>
      </Table.Cell>
    )
  }
  return <Table.Cell {...props} />
}

@connect(({ corporateBilling }) => ({ corporateBilling }))
class ListingMode extends PureComponent {
  state = {
    columns: [
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'payments', title: 'Payable Amount' },
      { name: 'outstandingBalance', title: 'O/S Balance' },
    ],
    currencyCols: [
      'payments',
    ],
    selection: [],
  }

  render () {
    const { columns, currencyCols, selection } = this.state
    const { dispatch, corporateBilling: { list } } = this.props
    const TableCell = (p) => Cell({ ...p, dispatch })

    const defaultSortCol = [
      { columnName: 'lastPayment', direction: 'desc' },
    ]
    const colExtenstions = [
      { columnName: 'outstandingBalance', align: 'right' },
      { columnName: 'amount', align: 'center' },
    ]
    return (
      <EditableTableGrid
        rows={list}
        columns={columns}
        currencyColumns={currencyCols}
        columnExtensions={colExtenstions}
      />
    )
  }
}

export default ListingMode
