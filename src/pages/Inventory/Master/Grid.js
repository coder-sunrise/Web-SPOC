import React, { PureComponent, useEffect } from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { Tooltip } from '@material-ui/core'
import { Edit, Search } from '@material-ui/icons'
import { Button, CommonTableGrid2 } from '@/components'

const Grid = (props) => {
  useEffect(() => {
    const { type, dispatch } = props
    dispatch({
      type: `${type}/query`,
    })
  }, [])

  const showDetail = (row, vmode) => () => {
    const { type, history } = props
    history.push(`/inventory/master/${type}?uid=${row.id}`)
  }

  const Cell = ({ column, row, dispatch, classes, ...p }) => {
    if (column.name === 'Action') {
      return (
        <Table.Cell {...p}>
          <Tooltip title='Detail' placement='bottom'>
            <Button
              size='sm'
              onClick={showDetail(row)}
              justIcon
              round
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

  const { tableParas, colExtensions, type, dispatch } = props
  const { list } = props[type]
  const TableCell = (pr) => Cell({ ...pr, dispatch })
  const ActionProps = { TableCellComponent: TableCell }

  return (
    <React.Fragment>
      <CommonTableGrid2
        rows={list}
        columnExtensions={colExtensions}
        ActionProps={ActionProps}
        FuncProps={{ pager: true }}
        {...tableParas}
      />
    </React.Fragment>
  )
}
export default Grid
