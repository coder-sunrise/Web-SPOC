import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import { CardContainer } from '@/components'
import FilterBar from './FilterBar'
import Grid from '../Grid'
import { status } from '@/utils/codes'

const styles = () => ({})
const Consumable = ({
  dispatch,
  history,
  consumable,
  values,
  setActiveTab,
}) => {
  const [
    tableParas,
    setTableParas,
  ] = useState({
    columns: [
      { name: 'code', title: 'Code' },
      { name: 'displayValue', title: 'Name' },
      { name: 'favouriteSupplier', title: 'Supplier' },
      { name: 'uom', title: 'Disp. UOM' },
      { name: 'stock', title: 'Stock' },
      { name: 'averageCostPrice', title: 'Avg Cost Price' },
      { name: 'sellingPrice', title: 'Selling Price' },
      { name: 'isActive', title: 'Status' },
      { name: 'action', title: 'Action' },
    ],
    leftColumns: [],
  })

  const [
    colExtensions,
    setColExtensions,
  ] = useState([
    { columnName: 'code', width: 130 },
    {
      columnName: 'favouriteSupplier',
      type: 'codeSelect',
      code: 'ctSupplier',
      labelField: 'displayValue',
      sortBy: 'favouriteSupplierFK',
    },
    {
      columnName: 'uom',
      type: 'codeSelect',
      code: 'ctConsumableUnitOfMeasurement',
      sortBy: 'UOMFkNavigation.DisplayValue',
      width: 110,
    },
    {
      columnName: 'stock',
      type: 'number',
      width: 110,
      sortingEnabled: false,
      precision: 1,
    },
    { columnName: 'action', width: 80, align: 'center' },
    {
      columnName: 'isActive',
      type: 'select',
      options: status,
      align: 'center',
      width: 80,
      sortingEnabled: false,
    },
    {
      columnName: 'averageCostPrice',
      type: 'number',
      currency: true,
      width: 120,
      precision: 4,
    },
    { columnName: 'sellingPrice', type: 'number', currency: true, width: 120 },
  ])

  const filterProps = {
    dispatch,
    history,
    values,
  }

  const [
    consumableList,
    setConsumableList,
  ] = useState([])

  const gridProps = {
    ...filterProps,
    consumable,
    namespace: 'consumable',
    list: consumableList || [],
    tableParas,
    colExtensions,
  }

  useEffect(() => {
    dispatch({
      type: 'consumable/query',
      payload: {
        sorting: [
          { columnName: 'effectiveEndDate', direction: 'desc' },
          { columnName: 'displayValue', direction: 'asc' },
        ],
      },
    })

    setActiveTab('1')
    // dispatch({
    //   type: 'inventoryMaster/updateState',
    //   payload: {
    //     currentTab: '1',
    //   },
    // })
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
  connect(({ consumable }) => ({
    consumable,
  })),
)(Consumable)
