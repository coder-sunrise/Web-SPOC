import React, { useState } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { CardContainer } from '@/components'
import { compose } from 'redux'
import FilterBar from './FilterBar'
import Grid from '../Grid'

const styles = () => ({})

const Vaccination = ({ dispatch, history, vaccination }) => {
  const [ tableParas, setTableParas ] = useState({
    columns: [
      { name: 'refNo', title: 'Code' },
      { name: 'patientName', title: 'Name' },
      { name: 'supplier', title: 'Supplier' },
      { name: 'category', title: 'Category' },
      { name: 'group', title: 'Group' },
      { name: 'status', title: 'Status' },
      { name: 'dispUOM', title: 'Disp. UOM' },
      { name: 'prescrUOM', title: 'Prescr. UOM' },
      { name: 'disPrescUOM', title: '1 Dis = Prescr. UOM' },
      { name: 'stock', title: 'Stock' },
      { name: 'payments', title: 'Avg Cost Price' },
      { name: 'expenseAmount', title: 'Selling Price' },
      { name: 'Action', title: 'Action' },
    ],
    leftColumns: [],
  })
  const [ colExtensions, setColExtensions ] = useState([
    { columnName: 'Action', width: 110, align: 'center' },
    { columnName: 'disPrescUOM', type: 'number' },
    { columnName: 'stock', type: 'number' },
    { columnName: 'payments', type: 'number', currency: true },
    { columnName: 'expenseAmount', type: 'number', currency: true },
  ])

  const filterProps = {
    dispatch,
    history,
  }

  const gridProps = {
    ...filterProps,
    vaccination,
    namespace: vaccination.namespace,
    list: vaccination.list || [],
    tableParas,
    colExtensions,
  }

  return (
    <CardContainer
      hideHeader
      style={{
        marginLeft: 5,
        marginRight: 5,
      }}
    >
      <FilterBar {...filterProps} />
      <Grid {...gridProps} />
    </CardContainer>
  )
}
export default compose(
  withStyles(styles),
  connect(({ vaccination }) => ({
    vaccination,
  })),
)(Vaccination)
