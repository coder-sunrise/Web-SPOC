import React, { useEffect, Fragment } from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Edit from '@material-ui/icons/Edit'

import { Button, CommonTableGrid, Tooltip, notification } from '@/components'
import Authorized from '@/utils/Authorized'

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
    } = this.props
    const showDetail = (row, vmode) => () =>
      history.push(`/inventory/master/edit${namespace}?uid=${row.id}`)

    const accessRightName = 'inventorymaster.package'
    const accessRight = Authorized.check(accessRightName)

    const handleDoubleClick = (row) => {
      if (!accessRight || accessRight.rights === 'hidden') {
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
              <Authorized.Context.Provider
                value={{
                  rights:
                    !accessRight || accessRight.rights === 'hidden'
                      ? 'hidden'
                      : 'enable',
                }}
              >
                <Fragment>
                  <Button
                    size='sm'
                    onClick={showDetail(row)}
                    justIcon
                    color='primary'
                    style={{ marginRight: 5 }}
                  >
                    <Edit />
                  </Button>
                </Fragment>
              </Authorized.Context.Provider>
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
