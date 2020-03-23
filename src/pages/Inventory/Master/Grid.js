import React, { useEffect } from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Edit from '@material-ui/icons/Edit'

import { Button, CommonTableGrid, Tooltip, notification } from '@/components'
import Authorized from '@/utils/Authorized'

const { Secured } = Authorized
@Secured('inventorymaster.inventoryitemdetails')
class Grid extends React.Component {
  render () {
    const {
      dispatch,
      namespace,
      history,
      tableParas,
      colExtensions,
      columnWidths,
      list,
      disabled,
    } = this.props
    const showDetail = (row, vmode) => () =>
      history.push(`/inventory/master/edit${namespace}?uid=${row.id}`)
    const handleDoubleClick = (row) => {
      if (disabled) {
        notification.error({
          message: 'Current user is not authorized to access',
        })
        return
      }

      history.push(`/inventory/master/edit${namespace}?uid=${row.id}`)
    }

    const Cell = ({ column, row, classes, ...p }) => {
      if (column.name === 'action') {
        return (
          <Table.Cell {...p}>
            <Tooltip
              title={`Edit ${namespace.charAt(0).toUpperCase() +
                namespace.slice(1)}`}
              placement='bottom'
            >
              <Button
                size='sm'
                onClick={showDetail(row)}
                justIcon
                color='primary'
                style={{ marginRight: 5 }}
              >
                <Edit />
              </Button>
            </Tooltip>
          </Table.Cell>
        )
      }
      return <Table.Cell {...p} />
    }
    const TableCell = (p) => Cell({ ...p, dispatch })

    const ActionProps = { TableCellComponent: TableCell }

    return (
      <CommonTableGrid
        type={`${namespace}`}
        rows={list}
        onRowDoubleClick={(row) => handleDoubleClick(row)}
        columnExtensions={colExtensions}
        defaultColumnWidths={columnWidths}
        ActionProps={ActionProps}
        FuncProps={{ pager: true }}
        {...tableParas}
      />
    )
  }
}

export default Grid
