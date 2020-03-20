import React, { useEffect } from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Edit from '@material-ui/icons/Edit'

import { Button, CommonTableGrid, Tooltip, notification } from '@/components'
import Authorized from '@/utils/Authorized'

const Grid = ({
  dispatch,
  namespace,
  history,
  tableParas,
  colExtensions,
  columnWidths,
  list,
}) => {
  const viewEditDetailAuthority = 'inventorymaster.inventoryitemdetails'

  const showDetail = (row, vmode) => () =>
    history.push(`/inventory/master/edit${namespace}?uid=${row.id}`)

  const handleDoubleClick = (row) => {
    const accessRight = Authorized.check(viewEditDetailAuthority)
    if (!accessRight || (accessRight && accessRight.rights !== 'enable')) {
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
          <Authorized authority={viewEditDetailAuthority}>
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
          </Authorized>
        </Table.Cell>
      )
    }
    return <Table.Cell {...p} />
  }
  const TableCell = (p) => Cell({ ...p, dispatch })

  const ActionProps = { TableCellComponent: TableCell }

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}
export default Grid
