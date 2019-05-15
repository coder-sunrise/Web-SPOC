import React, { PureComponent } from 'react'
import router from 'umi/router'
import moment from 'moment'
import { Table } from '@devexpress/dx-react-grid-material-ui'

import { Tooltip, withStyles } from '@material-ui/core'
import { PanTool, Edit, Search, Person } from '@material-ui/icons'
// import tooltipsStyle from 'assets/jss/material-kit-pro-react/tooltipsStyle.jsx'
import { sleep, getAppendUrl } from '@/utils/utils'
import { status, suppliers, dispUOMs } from '@/utils/codes'

import { Button, CommonModal, CommonTableGrid2 } from '@/components'

class Grid extends PureComponent {
  state = {
    selection: [],
  }

  tableParas = {
    columns: [
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'doctor', title: 'Doctor' },
      { name: 'refNo', title: 'Ref. No.' },
      { name: 'acctNo', title: 'Acc. No.' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'totalAfterGST', title: 'Total After GST' },
      { name: 'payments', title: 'Payments' },
      { name: 'creditNotes', title: 'Credit Notes' },
      { name: 'debitNotes', title: 'Debit Notes' },
      { name: 'osBal', title: 'O/S Bal.' },
      { name: 'Action', title: '' },
    ],
    columnExtensions: [
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
    ],

    leftColumns: [],
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'invoice/query',
    })
  }

  showDetail = (row, vmode) => () => {
    this.props.history.push(
      `/inventory/master/invoice?uid=${row.Id}&vmode=${vmode}`,
    )
  }

  Cell = ({ column, row, dispatch, classes, ...props }) => {
    // console.log(this)
    if (column.name === 'Action') {
      return (
        <Table.Cell {...props}>
          <Tooltip title='Detail' placement='bottom'>
            <Button
              size='sm'
              onClick={() => {
                const href = `/finance/invoice/${row.invoiceNo}`
                dispatch({
                  type: 'menu/updateBreadcrumb',
                  payload: {
                    href,
                    name: row.invoiceNo,
                  },
                })
                router.push(href)
              }}
              justIcon
              round
              color='primary'
              style={{ marginRight: 5 }}
            >
              <Search />
            </Button>
          </Tooltip>
          <Tooltip title='Update Visit Docotr' placement='bottom'>
            <Button size='sm' onClick={() => {}} justIcon round color='primary'>
              <Person />
            </Button>
          </Tooltip>
        </Table.Cell>
      )
    }
    return <Table.Cell {...props} />
  }

  render () {
    const { invoice: { list }, dispatch } = this.props
    const TableCell = (p) => this.Cell({ ...p, dispatch })
    const ActionProps = { TableCellComponent: TableCell }

    return (
      <React.Fragment>
        <CommonTableGrid2
          // height={500}
          rows={list}
          ActionProps={ActionProps}
          FuncProps={{ pager: true }}
          {...this.tableParas}
        />
      </React.Fragment>
    )
  }
}

export default Grid
