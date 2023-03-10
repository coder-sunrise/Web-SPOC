import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { compare } from '@/layouts'
import { status, suppliers, dispUOMs, yesNo } from '@/utils/codes'
import ReactDataSheet from 'react-datasheet'

@connect(({ consumable }) => ({
  consumable,
}))
@compare('consumable')
class ExcelGrid extends PureComponent {
  state = {
    pageSizes: [5, 10, 15],
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
  //   const { consumable: { list }, dispatch, height } = this.props

  //   dispatch({
  //     type: 'consumable/query',
  //   }).then((r) => {
  //     console.log(r, this.tableParas.columns)
  //     if (r) {
  //       this.setState({
  //         data: [
  //           this.tableParas.columns.map((col) => ({
  //             value: col.title,
  //             readOnly: true,
  //           })),
  //         ].concat(
  //           r.data.map((o) => {
  //             return this.tableParas.columns.map((g) => {
  //               const columnName = g.name
  //               const cfg = this.tableParas.columnExtensions.find(
  //                 (y) => y.columnName === columnName,
  //               )
  //               const obj = {
  //                 value: o[columnName],
  //                 column: columnName,
  //                 cfg,
  //               }
  //               return {
  //                 ...obj,
  //                 component: this.getComponent(obj),
  //               }
  //             })
  //           }),
  //         ),
  //       })
  //     }
  //   })
  // }

  getComponent = cell => {
    // console.log(cell)
    return null
  }

  changeEditingRowIds = editingRowIds => this.setState({ editingRowIds })

  changeRowChanges = rowChanges => {
    this.setState({ rowChanges })
  }

  commitChanges = ({ added, changed, deleted }) => {
    const { rows } = this.state
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
    this.setState(prevState => ({
      editingRowIds: prevState.editingRowIds.concat([row.id]),
    }))
  }

  render() {
    const { tableParas, rowChanges, editingRowIds, data } = this.state
    if (!data) return null
    // console.log(this.props)
    const {
      consumable: { list },
      dispatch,
      height,
    } = this.props
    // console.log(height)
    // if (this.state.height <= 0) return null

    return (
      // <EditableTableGrid
      //   height={height - 73}
      //   rows={list}
      //   showRowNumber
      //   onRowClick={this.clickRow}
      //   FuncProps={{ pager: true, pagerConfig: { pagesize: 100 } }}
      //   EditingProps={{
      //     editingRowIds,
      //     rowChanges,
      //     onEditingRowIdsChange: this.changeEditingRowIds,
      //     onRowChangesChange: this.changeRowChanges,
      //     onCommitChanges: this.commitChanges,
      //   }}
      //   {...this.tableParas}
      // />
      <ReactDataSheet
        data={this.state.data}
        valueRenderer={cell => cell.value}
        // sheetRenderer={(props) => (
        //   <table className={props.className + ' my-awesome-extra-class'}>
        //     <thead>
        //       <tr>
        //         {/* <th className='action-cell' /> */}
        //         {this.tableParas.columns.map((col) => <th>{col.title}</th>)}
        //       </tr>
        //     </thead>
        //     <tbody>{props.children}</tbody>
        //   </table>
        // )}
        onCellsChanged={changes => {
          const data = this.state.data.map(row => [...row])
          changes.forEach(({ cell, row, col, value }) => {
            data[row][col] = { ...data[row][col], value }
          })
          this.setState({ data })
        }}
      />
    )
  }
}

export default ExcelGrid
