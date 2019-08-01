import React, { PureComponent } from 'react'
import router from 'umi/router'
import moment from 'moment'
import { Table } from '@devexpress/dx-react-grid-material-ui'

import { Tooltip, withStyles } from '@material-ui/core'
import { Print, Edit, Search } from '@material-ui/icons'
// import tooltipsStyle from 'assets/jss/material-kit-pro-react/tooltipsStyle.jsx'
import { sleep, getAppendUrl } from '@/utils/utils'
import { status, suppliers, dispUOMs } from '@/utils/codes'

import {
  ProgressButton,
  Button,
  CommonModal,
  CommonTableGrid,
} from '@/components'

class Grid extends PureComponent {
  state = {
    tableParas: {
      columns: [
        { name: 'refNo', title: 'Referral Person Name' },
        { name: 'patientName', title: 'Mobile No.' },
        { name: 'supplier', title: 'Office No.' },
        { name: 'dispUOM', title: 'Referral Visit Count' },
        { name: 'gender', title: 'Remark' },
        { name: 'Action', title: 'Action' },
      ],
      leftColumns: [],
    },
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'schemeReferralPerson/query',
    })
  }

  showDetail = (row, vmode) => () => {
    this.props.history.push(
      `/finance/schemeReferralPerson/${row.Id}?vmode=${vmode}`,
    )
  }

  Cell = ({ column, row, dispatch, classes, ...props }) => {
    // console.log(this)
    if (column.name === 'Action') {
      return (
        <Table.Cell {...props}>
          <Tooltip title='View' placement='bottom'>
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
        </Table.Cell>
      )
    }
    return <Table.Cell {...props} />
  }

  render () {
    const { tableParas } = this.state
    // console.log(this.props)
    const { schemeReferralPerson: { list = [] }, dispatch } = this.props
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
      <div>
        <CommonTableGrid
          // height={500}
          rows={list}
          columnExtensions={colExtenstions}
          ActionProps={ActionProps}
          FuncProps={{ pager: true }}
          {...tableParas}
        />
      </div>
    )
  }
}

export default Grid
