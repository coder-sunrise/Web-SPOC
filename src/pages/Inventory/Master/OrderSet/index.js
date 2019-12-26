import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import { CardContainer } from '@/components'
import { status } from '@/utils/codes'
import FilterBar from './FilterBar'
import Grid from '../Grid'

const styles = () => ({})
const OrderSet = ({ dispatch, history, pack }) => {
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
    { columnName: 'code', width: 130 },
    { columnName: 'totalPrice', type: 'number', currency: true, width: 120 },
  ])

  const filterProps = {
    dispatch,
    history,
  }

  const getPackList = (list) => {
    if (list) {
      list.map((r) => {
        const {
          medicationOrderSetItem,
          consumableOrderSetItem,
          vaccinationOrderSetItem,
          serviceOrderSetItem,
        } = r
        let sellingPrice = 0
        medicationOrderSetItem.forEach((o) => {
          sellingPrice += o.subTotal
        })
        consumableOrderSetItem.forEach((o) => {
          sellingPrice += o.subTotal
        })
        vaccinationOrderSetItem.forEach((o) => {
          sellingPrice += o.subTotal
        })
        serviceOrderSetItem.forEach((o) => {
          sellingPrice += o.subTotal
        })
        return {
          ...r,
          totalPrice: sellingPrice,
        }
      })
    }

    return []
  }

  const gridProps = {
    ...filterProps,
    pack,
    namespace: 'orderSet',
    // list: getPackList(pack.list),
    list: pack.list || [],
    tableParas,
    colExtensions,
  }

  useEffect(() => {
    dispatch({
      type: 'pack/query',
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
        currentTab: '3',
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
  connect(({ pack }) => ({
    pack,
  })),
)(OrderSet)
