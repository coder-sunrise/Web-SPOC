import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { compare } from '@/layouts'
import router from 'umi/router'
import moment from 'moment'
import { Table } from '@devexpress/dx-react-grid-material-ui'

import { Tooltip, withStyles } from '@material-ui/core'
import { PanTool, Edit, Search } from '@material-ui/icons'
// import tooltipsStyle from 'assets/jss/material-kit-pro-react/tooltipsStyle.jsx'
import { sleep, getAppendUrl } from '@/utils/utils'
import { status, suppliers, dispUOMs, yesNo } from '@/utils/codes'

import { Button, CommonModal, EditableTableGrid } from '@/components'

@connect(({ consumable }) => ({
  consumable,
}))
@compare('consumable')
class BatchEditList extends PureComponent {
  state = {
    pageSizes: [
      5,
      10,
      15,
    ],
    selection: [],
    editingRowIds: [],
  }

  tableParas = {
    columns: [
      { name: 'refNo', title: 'Code' },
      { name: 'patientName', title: 'Name' },
      { name: 'supplier', title: 'Supplier' },
      { name: 'dispUOM', title: 'Disp. UOM' },
      { name: 'gender', title: 'Stock' },
      { name: 'payments', title: 'Avg Cost Price' },
      { name: 'expenseAmount', title: 'Selling Price' },
      { name: 'markupMargin', title: 'Selling Price' },
      { name: 'enableRetail', title: 'Enable Retail' },
      { name: 'expenseDate', title: 'Effective Start Date' },
      { name: 'EffectiveEndDate', title: 'Effective End Date' },
      { name: 'Category', title: 'Conumable Category' },
      { name: 'RevenueCategory', title: 'Revenue Category' },
      { name: 'LastCostPriceBefore', title: 'Last Cost Price (Before Bonus)' },
      { name: 'LastCostPriceAfter', title: 'Last Cost Price (After Bonus)' },
      { name: 'AverageCostPrice', title: 'Average Cost Price' },
    ],
    leftColumns: [],
    columnExtensions: [
      { columnName: 'payments', type: 'number', currency: true },
      { columnName: 'expenseAmount', type: 'number', currency: true },
      { columnName: 'expenseDate', type: 'date' },
      { columnName: 'EffectiveEndDate', type: 'date' },
      {
        columnName: 'supplier',
        type: 'select',
        options: suppliers,
        label: 'Supplier',
      },
      {
        columnName: 'enableRetail',
        type: 'select',
        options: yesNo,
        label: 'Enable Retail',
      },
      {
        columnName: 'dispUOM',
        type: 'select',
        options: dispUOMs,
        label: 'DispUOM',
      },
    ],
  }

  // componentDidMount () {
  //   this.props.dispatch({
  //     type: 'consumable/query',
  //   })
  // }

  changeEditingRowIds = (editingRowIds) => this.setState({ editingRowIds })

  changeRowChanges = (rowChanges) => {
    console.log(rowChanges)
    this.setState({ rowChanges })
  }

  commitChanges = ({ added, changed, deleted }) => {
    const { rows } = this.state
    console.log('commitChanges', added, changed, deleted)
    // let updatedRows = []
    // if (changed) {
    //   updatedRows = rows.map(
    //     (row) => (changed[row.id] ? { ...row, ...changed[row.id] } : row),
    //   )
    // }

    // this.setState({
    //   rows: updatedRows,
    // })
  }

  clickRow = (row, event) => {
    this.setState((prevState) => ({
      editingRowIds: prevState.editingRowIds.concat([
        row.id,
      ]),
    }))
  }

  render () {
    const { tableParas, rowChanges, editingRowIds } = this.state
    // console.log(this.props)
    const { consumable: { list }, dispatch, height } = this.props
    // console.log(height)
    // if (this.state.height <= 0) return null
    return (
      <EditableTableGrid
        height={height - 73}
        rows={list}
        showRowNumber
        onRowClick={this.clickRow}
        FuncProps={{ pager: true, pagerConfig: { pagesize: 100 } }}
        EditingProps={{
          editingRowIds,
          rowChanges,
          onEditingRowIdsChange: this.changeEditingRowIds,
          onRowChangesChange: this.changeRowChanges,
          onCommitChanges: this.commitChanges,
        }}
        {...this.tableParas}
      />
    )
  }
}

export default BatchEditList
