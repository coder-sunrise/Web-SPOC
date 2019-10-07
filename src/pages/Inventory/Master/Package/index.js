import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import { CardContainer } from '@/components'
import { status } from '@/utils/codes'
import FilterBar from './FilterBar'
import Grid from '../Grid'

const styles = () => ({})
const Package = ({ dispatch, history, pack }) => {
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
      width: 120,
    },
    { columnName: 'Action', width: 110, align: 'center' },
    { columnName: 'code', width: 230 },
    { columnName: 'totalPrice', type: 'number', currency: true, width: 220 },
  ])

  const filterProps = {
    dispatch,
    history,
  }

  const getPackList = (list) => {
    console.log('list', list)
    if (list) {
      list.map((r) => {
        const {
          medicationPackageItem,
          consumablePackageItem,
          vaccinationPackageItem,
          servicePackageItem,
        } = r
        let sellingPrice = 0
        medicationPackageItem.forEach((o) => {
          sellingPrice += o.subTotal
        })
        consumablePackageItem.forEach((o) => {
          sellingPrice += o.subTotal
        })
        vaccinationPackageItem.forEach((o) => {
          sellingPrice += o.subTotal
        })
        servicePackageItem.forEach((o) => {
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
    namespace: 'package',
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
)(Package)
