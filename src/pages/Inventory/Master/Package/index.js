import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import { CardContainer } from '@/components'
import { status } from '@/utils/codes'
import FilterBar from './FilterBar'
import Grid from '../Grid'

const styles = () => ({})
const Package = ({ dispatch, history, inventoryPackage }) => {
  const [
    tableParas,
    setTableParas,
  ] = useState({
    columns: [
      { name: 'code', title: 'Code' },
      { name: 'displayValue', title: 'Name' },
      { name: 'totalPrice', title: 'Selling Price' },
      { name: 'isActive', title: 'Status' },
      { name: 'action', title: 'Action' },
    ],
    leftColumns: [],
  })

  const [
    colExtensions,
    setColExtensions,
  ] = useState([
    {
      columnName: 'isActive',
      sortingEnabled: false,
      type: 'select',
      options: status,
      align: 'center',
      width: 80,
    },
    { columnName: 'action', width: 80, align: 'center' },
    { columnName: 'code', width: 280 },
    { columnName: 'totalPrice', type: 'number', currency: true, width: 120 },
  ])

  const filterProps = {
    dispatch,
    history,
  }

  const gridProps = {
    ...filterProps,
    inventoryPackage,
    namespace: 'package',
    list: inventoryPackage.list || [],
    tableParas,
    colExtensions,
  }

  useEffect(() => {
    dispatch({
      type: 'inventoryPackage/query',
      payload: {
        sorting: [
          { columnName: 'effectiveEndDate', direction: 'desc' },
          { columnName: 'displayValue', direction: 'asc' },
        ],
      },
    })
    dispatch({
      type: 'inventoryMaster/updateState',
      payload: {
        currentTab: '4',
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
      <FilterBar {...filterProps} />
      <Grid {...gridProps} />
    </CardContainer>
  )
}

export default compose(
  withStyles(styles),
  connect(({ inventoryPackage }) => ({
    inventoryPackage,
  })),
)(Package)
