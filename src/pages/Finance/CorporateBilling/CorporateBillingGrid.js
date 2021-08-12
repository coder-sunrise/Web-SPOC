import React, { PureComponent, Fragment } from 'react'
import { status } from '@/utils/codes'
import MoreVert from '@material-ui/icons/MoreVert'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { Button, CommonTableGrid, Tooltip, dateFormatLong } from '@/components'

const CellBase = props => {
  const { column, row, onRowDoubleClick } = props
  if (column.name === 'Action') {
    return (
      <Table.Cell {...props}>
        <Tooltip id='tooltip-left' title='View Details' placement='bottom'>
          <Button
            size='sm'
            onClick={() => {
              onRowDoubleClick(row)
            }}
            justIcon
            round
            color='primary'
            style={{ marginRight: 5 }}
          >
            <MoreVert />
          </Button>
        </Tooltip>
      </Table.Cell>
    )
  }
  return <Table.Cell {...props} />
}

export const Cell = CellBase

class CorporateBillingGrid extends PureComponent {
  state = {
    columns: [
      { name: 'isActive', title: 'Status' },
      { name: 'displayValue', title: 'Company' },
      { name: 'outstandingBalance', title: 'O/S Balance' },
      { name: 'lastPaymentDate', title: 'Last Payment' },
      { name: 'contactPerson', title: 'Contact Person' },
      { name: 'officeNo', title: 'Office No.' },
      { name: 'faxNo', title: 'Fax No.' },
      { name: 'email', title: 'Email' },
      { name: 'Action', title: 'Action' },
    ],
    columnExtensions: [
      {
        columnName: 'Action',
        width: 95,
        align: 'center',
        sortingEnabled: false,
      },
      { columnName: 'contactPerson', width: 130 },
      { columnName: 'displayValue' },
      {
        columnName: 'lastPaymentDate',
        width: 140,
        type: 'date',
        format: dateFormatLong,
        sortingEnabled: false,
      },
      {
        columnName: 'officeNo',
        sortingEnabled: false,
        width: 130,
        render: row => {
          return (
            <span>
              {row.contact &&
              row.contact.officeContactNumber &&
              row.contact.officeContactNumber.number !== ''
                ? row.contact.officeContactNumber.number
                : '-'}
            </span>
          )
        },
      },
      {
        columnName: 'faxNo',
        sortingEnabled: false,
        width: 130,
        render: row => {
          return (
            <span>
              {row.contact &&
              row.contact.faxContactNumber &&
              row.contact.faxContactNumber.number !== ''
                ? row.contact.faxContactNumber.number
                : '-'}
            </span>
          )
        },
      },
      {
        columnName: 'email',
        sortingEnabled: false,
        width: 130,
        render: row => {
          return (
            <span>
              {row.contact &&
              row.contact.contactEmailAddress &&
              row.contact.contactEmailAddress.emailAddress !== ''
                ? row.contact.contactEmailAddress.emailAddress
                : '-'}
            </span>
          )
        },
      },
      {
        columnName: 'isActive',
        sortingEnabled: false,
        type: 'select',
        options: status,
        align: 'center',
        width: 120,
      },
      {
        columnName: 'outstandingBalance',
        align: 'right',
        type: 'number',
        width: 130,
        sortingEnabled: false,
        currency: true,
      },
    ],
  }

  FuncConfig = {
    sort: true,
    sortConfig: {
      defaultSorting: [{ columnName: 'displayValue', direction: 'asc' }],
    },
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'corporateBilling/query',
      payload: {
        id: undefined,
        isActive: undefined,
        apiCriteria: {
          outstandingBalanceStatus: undefined,
        },
      },
    })
  }

  render() {
    const { columns, columnExtensions } = this.state
    const {
      corporateBilling: { list },
      dispatch,
      onRowDoubleClick,
      gridHeight,
    } = this.props

    const TableCell = p => Cell({ ...p, dispatch, onRowDoubleClick })

    const ActionProps = { TableCellComponent: TableCell }

    return (
      <Fragment>
        <CommonTableGrid
          type='corporateBilling'
          forceRender
          FuncProps={this.FuncConfig}
          columns={columns}
          TableProps={{ height: gridHeight }}
          columnExtensions={columnExtensions}
          onRowDoubleClick={onRowDoubleClick}
          ActionProps={ActionProps}
        />
      </Fragment>
    )
  }
}

export default CorporateBillingGrid
