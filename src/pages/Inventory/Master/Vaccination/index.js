import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { CardContainer } from '@/components'
import { compose } from 'redux'
import FilterBar from './FilterBar'
import Grid from '../Grid'
import { status } from '@/utils/codes'

const styles = () => ({})

const Vaccination = ({ dispatch, history, vaccination, values }) => {
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
      sortingEnabled: false,
    },
    {
      columnName: 'dispensingUOM',
      type: 'codeSelect',
      code: 'ctvaccinationunitofmeasurement',
      sortingEnabled: false,
    },
    {
      columnName: 'stock',
      type: 'number',
    },
    {
      columnName: 'isActive',
      sortingEnabled: false,
      type: 'select',
      options: status,
    },
    {
      columnName: 'averageCostPrice',
      type: 'number',
      currency: true,
      format: '0.0000',
    },
    { columnName: 'sellingPrice', type: 'number', currency: true },
  ])

  const filterProps = {
    dispatch,
    history,
    values,
  }

  const gridProps = {
    ...filterProps,
    vaccination,
    namespace: 'vaccination',
    list: vaccination.list || [],
    tableParas,
    colExtensions,
  }

  // useEffect(() => {
  //   dispatch({
  //     type: 'vaccination/query',
  //   })
  // }, [])

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
