import React, { useEffect } from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Edit from '@material-ui/icons/Edit'

import { Button, CommonTableGrid, Tooltip } from '@/components'
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
  const showDetail = (row, vmode) => () =>
    history.push(`/inventory/master/edit${namespace}?uid=${row.id}`)

  const handleDoubleClick = (row) =>
    history.push(`/inventory/master/edit${namespace}?uid=${row.id}`)

  const Cell = ({ column, row, classes, ...p }) => {
    if (column.name === 'action') {
      return (
        <Table.Cell {...p}>
          <Authorized authority='inventorymaster.inventoryitemdetails'>
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
        type={`${namespace}` === 'orderSet' ? 'pack' : `${namespace}`}
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
