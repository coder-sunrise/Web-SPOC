import React, { PureComponent } from 'react'
import router from 'umi/router'
import moment from 'moment'
import { Table } from '@devexpress/dx-react-grid-material-ui'

import { Tooltip, withStyles } from '@material-ui/core'
import { PanTool, Edit, Search } from '@material-ui/icons'
// import tooltipsStyle from 'assets/jss/material-kit-pro-react/tooltipsStyle.jsx'
import { sleep, getAppendUrl } from '@/utils/utils'
import { status, suppliers, dispUOMs } from '@/utils/codes'

import { Button, CommonModal, CommonTableGrid2 } from '@/components'

class Grid extends PureComponent {
  state = {
    pageSizes: [
      5,
      10,
      15,
    ],
    selection: [],
    showDepositRefundModal: false,
    tableParas: {
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
    },
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'scheme/query',
    })
  }

  showDetail = (row, vmode) => () => {
    this.props.history.push(`/finance/scheme/${row.Id}?vmode=${vmode}`)
  }

  Cell = ({ column, row, dispatch, classes, ...props }) => {
    // console.log(this)
    if (column.name === 'Action') {
      return (
        <Table.Cell {...props}>
          <Tooltip title='Detail' placement='bottom'>
            <Button
              size='sm'
              onClick={this.showDetail(row)}
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
              onClick={this.showDetail(row, 1)}
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

  render () {
    const { tableParas } = this.state
    // console.log(this.props)
    const { scheme: { list }, dispatch } = this.props
    const TableCell = (p) => this.Cell({ ...p, dispatch })
    const colExtenstions = [
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
    ]
    const ActionProps = { TableCellComponent: TableCell }

    return (
      <React.Fragment>
        <CommonTableGrid2
          // height={500}
          rows={list}
          columnExtensions={colExtenstions}
          ActionProps={ActionProps}
          FuncProps={{ pager: true }}
          {...tableParas}
        />
      </React.Fragment>
    )
  }
}

export default Grid
