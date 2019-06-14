import React, { PureComponent } from 'react'
import { connect } from 'dva'
import router from 'umi/router'
// material ui
import Pageview from '@material-ui/icons/Pageview'
// dev grid
import { Table } from '@devexpress/dx-react-grid-material-ui'
// custom component
import { Button, CommonTableGrid2, Tooltip } from '@/components'

const CellBase = (props) => {
  const { column, row, dispatch } = props
  if (column.name === 'Action') {
    return (
      <Table.Cell {...props}>
        <Tooltip id='tooltip-left' title='View Details' placement='bottom'>
          <Button
            size='sm'
            onClick={() => {
              const href = `/finance/billing/${row.company.replace(
                / /g,
                '&nbsp',
              )}`
              dispatch({
                type: 'menu/updateBreadcrumb',
                payload: {
                  href,
                  name: row.company,
                },
              })
              router.push(href)
            }}
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
  return <Table.Cell {...props} />
}

export const Cell = CellBase

@connect(({ corporateBilling }) => ({
  corporateBilling,
}))
class CorporateBillingGrid extends PureComponent {
  state = {
    columns: [
      { name: 'status', title: 'Status' },
      { name: 'company', title: 'Company' },
      { name: 'outstandingBalance', title: 'O/S Balance' },
      { name: 'lastPayment', title: 'Last Payment' },
      { name: 'contactPerson', title: 'Contact Person' },
      { name: 'officeNo', title: 'Office No.' },
      { name: 'faxNo', title: 'Fax No.' },
      { name: 'Action', title: 'Action' },
    ],
    columnExtensions: [
      { columnName: 'Action', width: 95, align: 'center' },
      { columnName: 'contactPerson', align: 'center' },
      { columnName: 'lastPayment', type: 'date' },
      {
        columnName: 'outstandingBalance',
        align: 'right',
        type: 'number',
        currency: true,
      },
    ],
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'corporateBilling/query',
    })
  }

  render () {
    const { columns, columnExtensions } = this.state
    const { corporateBilling: { list }, dispatch } = this.props
    const TableCell = (p) => Cell({ ...p, dispatch })
    const defaultSortCol = [
      { columnName: 'lastPayment', direction: 'desc' },
    ]

    const ActionProps = { TableCellComponent: TableCell }

    return (
      <CommonTableGrid2
        rows={list}
        columns={columns}
        columnExtensions={columnExtensions}
        defaultSorting={defaultSortCol}
        ActionProps={ActionProps}
      />
    )
  }
}

export default CorporateBillingGrid
