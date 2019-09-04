import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { CardContainer } from '@/components'
import { compose } from 'redux'
import FilterBar from './FilterBar'
import Grid from '../Grid'

const styles = () => ({})

const Vaccination = ({ dispatch, history, vaccination }) => {
  const [
    tableParas,
    setTableParas,
  ] = useState({
    columns: [
      { name: 'code', title: 'Code' },
      { name: 'displayValue', title: 'Name' },
      { name: 'supplier', title: 'Supplier' },
      { name: 'dispensingUOMFk', title: 'Disp. UOM' },
      { name: 'stock', title: 'Stock' },
      { name: 'averageCostPrice', title: 'Avg Cost Price' },
      { name: 'sellingPriceBefDiscount', title: 'Selling Price' },
      { name: 'isActive', title: 'Status' },
      { name: 'Action', title: 'Action' },
    ],
    leftColumns: [],
  })

  const [
    colExtensions,
    setColExtensions,
  ] = useState([
    { columnName: 'Action', width: 110, align: 'center' },
    {
      columnName: 'supplier',
      type: 'select',
      options: [],
      label: 'Supplier',
    },
    {
      columnName: 'dispUOM',
      align: 'select',
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
    vaccination,
    namespace: vaccination.namespace,
    list: vaccination.list || [],
    tableParas,
    colExtensions,
  }

  useEffect(() => {
    dispatch({
      type: 'vaccination/query',
    })
  }, [])

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
