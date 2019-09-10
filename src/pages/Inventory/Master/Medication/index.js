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
  console.log('values', values, medication)
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
      code: 'ctCompany',
    },
    {
      columnName: 'dispensingUOM',
      type: 'codeSelect',
      code: 'ctmedicationunitofmeasurement',
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
    { columnName: 'averageCostPrice', type: 'number', currency: true },
    { columnName: 'sellingPrice', type: 'number', currency: true },
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

    tableParas,
    colExtensions,
  }

  useEffect(() => {
    dispatch({
      type: 'medication/query',
    }).then((v) => {
      const { data } = v
      dispatch({
        type: 'medication/updateState',
        payload: {
          list: data.map((o) => {
            return {
              ...o,
              favouriteSupplier: o.favouriteSupplier
                ? o.favouriteSupplier.id
                : undefined,
              dispensingUOM: o.dispensingUOM ? o.dispensingUOM.id : undefined,
            }
          }),
        },
      })
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
  connect(({ medication }) => ({
    medication,
  })),
)(Medication)
