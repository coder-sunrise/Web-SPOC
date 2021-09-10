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
      { name: 'favouriteSupplier', title: 'Supplier' },
      { name: 'genericMedication', title: 'Generic Drug' },
      { name: 'medicationGroup', title: 'Drug Group' },
      { name: 'dispensingUOM', title: 'Disp. UOM' },
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
      columnName: 'favouriteSupplier',
      type: 'codeSelect',
      code: 'ctSupplier',
      sortBy: 'FavouriteSupplierFkNavigation.displayValue',
      labelField: 'displayValue',
      width: 250,
    },
    {
      columnName: 'dispensingUOM',
      type: 'codeSelect',
      code: 'ctmedicationunitofmeasurement',
      labelField: 'displayValue',
      sortBy: 'DispensingUOMFkNavigation.DisplayValue',
    },
    {
      columnName: 'medicationGroup',
      type: 'codeSelect',
      code: 'ctmedicationgroup',
      sortBy: 'MedicationGroupFkNavigation.displayValue',
      width: 150,
    },
    {
      columnName: 'genericMedication',
      type: 'codeSelect',
      code: 'ctgenericmedication',
      sortBy: 'GenericMedicationFkNavigation.displayValue',
      labelField: 'displayValue',
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
