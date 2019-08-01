import React, { useState, useEffect } from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { Tooltip } from '@material-ui/core'
import { Edit, Print } from '@material-ui/icons'
import { Button, CommonTableGrid } from '@/components'

const Grid = (props) => {
  console.log('Grid render')
  const [ pageSizes, setPagesizes ] = useState([ 5, 10, 15 ])
  const [ selection, setSelecion ] = useState([])
  const { dispatch, list } = props

  const tableParas = {
    columns: [
      { name: 'PODate', title: 'PO Date' },
      { name: 'PONo', title: 'PO No' },
      { name: 'ExpDeliveryDate', title: 'Expected Delivery Date' },
      { name: 'Status', title: 'Status' },
      { name: 'Stock', title: 'Stock' },
      { name: 'Remarks', title: 'Remarks' },
      { name: 'Action', title: 'Action' },
    ],
    leftColumns: [],
  }

  const colExtensions = [
    { columnName: 'Action', width: 110, align: 'center' },
  ]

  useEffect(() => {
    console.log('grid effect trigger')
    // dispatch({
    //   type: 'purchasedelivery/query',
    // })
  }, [])

  const showDetail = (row, vmode) => () => {
    const { type, history } = props
    history.push(`/inventory/pd/${type}?uid=${row.Id}&vmode=${vmode}`)
  }
  const Cell = ({ column, row, classes, ...p }) => {
    if (column.name === 'Action') {
      return (
        <Table.Cell {...p}>
          <Tooltip title='Edit' placement='bottom'>
            <Button
              size='sm'
              onClick={showDetail(row, 1)}
              justIcon
              round
              color='primary'
              style={{ marginRight: 5 }}
            >
              <Edit />
            </Button>
          </Tooltip>
          <Tooltip title='Print' placement='bottom'>
            <Button
              size='sm'
              onClick={showDetail(row, 1)}
              justIcon
              round
              color='primary'
              style={{ marginRight: 5 }}
            >
              <Print />
            </Button>
          </Tooltip>
        </Table.Cell>
      )
    }
    return <Table.Cell {...props} />
  }
  const TableCell = (p) => Cell({ ...p })
  const ActionProps = { TableCellComponent: TableCell }

  return (
    <React.Fragment>
      <CommonTableGrid
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
