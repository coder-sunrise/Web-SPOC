import React, { useState, useEffect } from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { Tooltip } from '@material-ui/core'
import { Edit, Search } from '@material-ui/icons'
import { suppliers, dispUOMs } from '@/utils/codes'

import { Button, CommonTableGrid } from '@/components'

const Grid = ({ history, dispatch, scheme: { list } }) => {
  const [ tableParas, setTableParas ] = useState({
    columns: [
      { name: 'refNo', title: 'Co-Payer Type' },
      { name: 'patientName', title: 'Scheme Name' },
      { name: 'supplier', title: 'Scheme Code' },
      { name: 'dispUOM', title: 'Scheme Type' },
      { name: 'gender', title: 'Co-Payer Name' },
      { name: 'payments', title: 'Scheme Category' },
      { name: 'expenseAmount', title: 'Status' },
      { name: 'expenseAmount', title: 'Description' },
      { name: 'Action', title: 'Action' },
    ],
    leftColumns: [],
  })
  const [ colExtenstions, setColExtenstions ] = useState([
    { columnName: 'Action', width: 110, align: 'center' },
    {
      columnName: 'supplier',
      type: 'select',
      options: suppliers,
      label: 'Supplier',
    },
    {
      columnName: 'dispUOM',
      align: 'select',
      options: dispUOMs,
      label: 'DispUOM',
    },
    { columnName: 'payments', type: 'number', currency: true },
    { columnName: 'expenseAmount', type: 'number', currency: true },
  ])
  useEffect(() => {
    dispatch({
      type: 'scheme/query',
    })
  }, [])

  const showDetail = (row, vmode) => () => {
    history.push(`/finance/scheme/details?uid=${row.id}`)
  }

  const Cell = ({ column, row, classes, ...props }) => {
    if (column.name === 'Action') {
      return (
        <Table.Cell {...props}>
          <Tooltip title='Detail' placement='bottom'>
            <Button
              size='sm'
              onClick={showDetail(row)}
              justIcon
              round
              color='primary'
              style={{ marginRight: 5 }}
            >
              <Search />
            </Button>
          </Tooltip>
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
        </Table.Cell>
      )
    }
    return <Table.Cell {...props} />
  }

  const TableCell = (p) => Cell({ ...p, dispatch })
  const ActionProps = { TableCellComponent: TableCell }
  return (
    <React.Fragment>
      <CommonTableGrid
        rows={list}
        columnExtensions={colExtenstions}
        ActionProps={ActionProps}
        FuncProps={{ pager: true }}
        {...tableParas}
      />
    </React.Fragment>
  )
}
export default Grid
