import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { CardContainer } from '@/components'
import { status } from '@/utils/codes'
import FilterBar from './FilterBar'
import Grid from '../Grid'

const styles = () => ({})

const Medication = ({ dispatch, history, medication, values }) => {
  const [tableParas, setTableParas] = useState({
    columns: [
      { name: 'code', title: 'Code' },
      { name: 'displayValue', title: 'Name' },
      { name: 'favouriteSupplierName', title: 'Supplier' },
      { name: 'genericMedicationName', title: 'Generic Drug' },
      { name: 'medicationGroupName', title: 'Drug Group' },
      { name: 'dispensingUOMName', title: 'Disp. UOM' },
      { name: 'stock', title: 'Stock' },
      { name: 'averageCostPrice', title: 'Avg Cost Price' },
      { name: 'sellingPrice', title: 'Selling Price' },
      { name: 'isActive', title: 'Status' },
      { name: 'action', title: 'Action' },
    ],
    leftColumns: [],
  })

  const [colExtensions, setColExtensions] = useState([
    { columnName: 'code', width: 130 },
    { columnName: 'displayValue', width: 300 },
    { columnName: 'action', width: 80, align: 'center' },
    {
      columnName: 'favouriteSupplierName',
      sortBy: 'FavouriteSupplierFkNavigation.displayValue',
      width: 250,
    },
    {
      columnName: 'dispensingUOMName',
      sortBy: 'DispensingUOMFkNavigation.DisplayValue',
    },
    {
      columnName: 'medicationGroupName',
      sortingEnabled: false,
      width: 150,
    },
    {
      columnName: 'genericMedicationName',
      sortBy: 'GenericMedicationFkNavigation.displayValue',
      width: 150,
    },
    {
      columnName: 'stock',
      type: 'number',
      width: 110,
      sortingEnabled: false,
      precision: 1,
    },
    {
      columnName: 'isActive',
      sortingEnabled: false,
      type: 'select',
      options: status,
      align: 'center',
      width: 80,
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
  }, [])

  return (
    <CardContainer
      hideHeader
      style={{
        marginLeft: 5,
        marginRight: 5,
      }}
    >
      <div className='filterBar'>
        <FilterBar {...filterProps} />
      </div>
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
