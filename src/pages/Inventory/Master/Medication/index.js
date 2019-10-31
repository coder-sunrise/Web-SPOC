import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { CardContainer } from '@/components'
import FilterBar from './FilterBar'
import Grid from '../Grid'
import { status } from '@/utils/codes'

const styles = () => ({})

const Medication = ({ dispatch, history, medication, values }) => {
  const [
    tableParas,
    setTableParas,
  ] = useState({
    columns: [
      { name: 'code', title: 'Code' },
      { name: 'displayValue', title: 'Name' },
      { name: 'favouriteSupplier', title: 'Supplier' },
      { name: 'dispensingUOM', title: 'Disp. UOM' },
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
    { columnName: 'action', width: 110, align: 'center' },
    {
      columnName: 'favouriteSupplier',
      type: 'codeSelect',
      code: 'ctSupplier',
      sortBy: 'FavouriteSupplierFkNavigation.displayValue',
      labelField: 'displayValue',
    },
    {
      columnName: 'dispensingUOM',
      type: 'codeSelect',
      code: 'ctmedicationunitofmeasurement',
      sortBy: 'dispensingUOMFK',
      width: 110,
    },
    {
      columnName: 'stock',
      type: 'number',
      width: 110,
      sortingEnabled: false,
    },
    {
      columnName: 'isActive',
      sortingEnabled: false,
      type: 'select',
      options: status,
      align: 'center',
      width: 120,
    },
    {
      columnName: 'averageCostPrice',
      type: 'number',
      currency: true,
      width: 120,
      format: '0.0000',
    },
    { columnName: 'sellingPrice', type: 'number', currency: true, width: 200 },
  ])

  const filterProps = {
    dispatch,
    history,
    values,
  }

  const gridProps = {
    ...filterProps,
    medication,
    namespace: 'medication',
    list: medication.list || [],
    columnWidths: [
      {
        columnName: 'dispensingUOM',
        width: 20,
      },
      {
        columnName: 'stock',
        width: 'auto',
      },
    ],
    tableParas,
    colExtensions,
  }

  useEffect(() => {
    dispatch({
      type: 'medication/query',
      payload: {
        sorting: [
          { columnName: 'effectiveEndDate', direction: 'desc' },
          { columnName: 'displayValue', direction: 'asc' },
        ],
      },
    })
    // dispatch({
    //   type: 'inventoryMaster/updateState',
    //   payload: {
    //     currentTab: '0',
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
  connect(({ medication }) => ({
    medication,
  })),
)(Medication)
