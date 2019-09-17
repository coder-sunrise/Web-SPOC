import React, { useEffect } from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { Tooltip } from '@material-ui/core'
import { Edit } from '@material-ui/icons'
import { Button, CommonTableGrid } from '@/components'

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
