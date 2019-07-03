import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Remove from '@material-ui/icons/Remove'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import {
  CommonTableGrid,
  CommonTableGrid2,
  Tooltip,
  Button,
  GridContainer,
  GridItem,
} from '@/components'

const styles = () => ({})

const Grid = ({
  dispatch,
  namespace,
  history,
  tableParas,
  colExtensions,
  list,
}) => {
  // useEffect(() => {
  //   dispatch({
  //     type: `${namespace}/query`,
  //   })
  // }, [])

  const Cell = ({ column, row, classes, ...p }) => {
    if (column.name === 'Action') {
      return (
        <Table.Cell {...p}>
          <Tooltip title='Remove' placement='bottom'>
            <Button
              size='sm'
              onClick={() => console.log(row)}
              justIcon
              round
              color='primary'
              style={{ marginRight: 5 }}
            >
              <Remove />
            </Button>
          </Tooltip>
        </Table.Cell>
      )
    }
    return <Table.Cell {...p} />
  }
  const TableCell = (p) => Cell({ ...p, dispatch })

  return (
    <CommonTableGrid2
      {...tableParas}
      columnExtensions={colExtensions}
      rows={[]}
      FuncProps={{ pager: false }}
      ActionProps={{ TableCellComponent: TableCell }}
    />
  )
}
export default withStyles(styles, { withTheme: true })(Grid)
