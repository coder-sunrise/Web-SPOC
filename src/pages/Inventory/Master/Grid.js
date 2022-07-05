import React, { Fragment } from 'react'
import $ from 'jquery'
import { connect } from 'dva'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Edit from '@material-ui/icons/Edit'
import { Button, CommonTableGrid, Tooltip, notification } from '@/components'

@connect(({ global }) => ({
  mainDivHeight: global.mainDivHeight,
}))
class Grid extends React.Component {
  render() {
    const {
      dispatch,
      namespace,
      history,
      tableParas,
      colExtensions,
      columnWidths,
      list,
      disabled,
      mainDivHeight,
    } = this.props
    const showDetail = row => () =>
      history.push(`/inventory/master/edit${namespace}?uid=${row.id}`)
    const handleDoubleClick = row => {
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
            </Tooltip>
          </Table.Cell>
        )
      }
      return <Table.Cell {...p} />
    }
    const TableCell = p => Cell({ ...p, dispatch })

    const ActionProps = { TableCellComponent: TableCell }
    let height =
      mainDivHeight - 195 - ($(`.filter${namespace}Bar`).height() || 0)
    if (height < 300) height = 300
    return (
      <CommonTableGrid
        type={`${namespace}`}
        rows={list}
        onRowDoubleClick={row => handleDoubleClick(row)}
        columnExtensions={colExtensions}
        defaultColumnWidths={columnWidths}
        ActionProps={ActionProps}
        FuncProps={{ pager: true }}
        {...tableParas}
        TableProps={{
          height,
        }}
      />
    )
  }
}

export default Grid
