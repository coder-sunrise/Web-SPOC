import React, { useState } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { CardContainer } from '@/components'
import { compose } from 'redux'
import FilterBar from './FilterBar'
import Grid from '../Grid'

const styles = () => ({})
const Consumable = ({ dispatch, history, consumable }) => {
  const [ tableParas, setTableParas ] = useState({
    columns: [
      { name: 'refNo', title: 'Code' },
      { name: 'patientName', title: 'Name' },
      { name: 'supplier', title: 'Supplier' },
      { name: 'dispUOM', title: 'Disp. UOM' },
      { name: 'stock', title: 'Stock' },
      { name: 'payments', title: 'Avg Cost Price' },
      { name: 'expenseAmount', title: 'Selling Price' },
      { name: 'Action', title: 'Action' },
    ],
    leftColumns: [],
  })

  const [ colExtensions, setColExtensions ] = useState([
    { columnName: 'Action', width: 110, align: 'center' },
    {
      columnName: 'supplier',
      type: 'select',
      options: [],
      label: 'Supplier',
    },
    {
      columnName: 'dispUOM',
      type: 'select',
      options: [],
      label: 'DispUOM',
    },
    { columnName: 'payments', type: 'number', currency: true },
    { columnName: 'expenseAmount', type: 'number', currency: true },
  ])

  const filterProps = {
    dispatch,
    history,
  }
  const gridProps = {
    ...filterProps,
    consumable,
    namespace: consumable.namespace,
    list: consumable.list || [],
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
  connect(({ consumable }) => ({
    consumable,
  })),
)(Consumable)
