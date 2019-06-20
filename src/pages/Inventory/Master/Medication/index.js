import React, { useState } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { CardContainer } from '@/components'
import FilterBar from './FilterBar'
import Grid from '../Grid'

const styles = () => ({})

const Medication = ({ dispatch, history, medication }) => {
  const [ tableParas, setTableParas ] = useState({
    columns: [
      { name: 'code', title: 'Code' },
      { name: 'displayValue', title: 'Name' },
      { name: 'supplier', title: 'Supplier' },
      { name: 'revenueCategory', title: 'Category' },
      { name: 'group', title: 'Group' },
      { name: 'status', title: 'Status' },
      { name: 'dispenseUOM', title: 'Disp. UOM' },
      { name: 'prescribeUOM', title: 'Prescr. UOM' },
      {
        name: 'dispenseUOMtoPrescribeUOMMeasurement',
        title: '1 Dis = Prescr. UOM',
      },
      { name: 'stock', title: 'Stock' },
      { name: 'averageCostPrice', title: 'Avg Cost Price' },
      { name: 'suggestSellingPrice', title: 'Selling Price' },
      { name: 'Action', title: 'Action' },
    ],
    leftColumns: [],
  })
  const [ colExtensions, setColExtensions ] = useState([
    { columnName: 'Action', width: 110, align: 'center' },
    { columnName: 'averageCostPrice', type: 'number', currency: true },
    { columnName: 'suggestSellingPrice', type: 'number', currency: true },
  ])

  const filterProps = {
    dispatch,
    history,
  }

  const gridProps = {
    ...filterProps,
    medication,
    namespace: medication.namespace,
    list: medication.list || [],
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
  connect(({ medication }) => ({
    medication,
  })),
)(Medication)
