import React, { useState } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { CardContainer } from '@/components'
import { compose } from 'redux'
import FilterBar from './FilterBar'
import Grid from '../Grid'

const styles = () => ({})
const Package = ({ dispatch, history, pack }) => {
  const [ tableParas, setTableParas ] = useState({
    columns: [
      { name: 'refNo', title: 'Code' },
      { name: 'patientName', title: 'Name' },
      { name: 'payments', title: 'Avg Cost Price' },
      { name: 'expenseAmount', title: 'Selling Price' },
      { name: 'Action', title: 'Action' },
    ],
    leftColumns: [],
  })
  const [ colExtensions, setColExtensions ] = useState([
    { columnName: 'Action', width: 110, align: 'center' },
    { columnName: 'payments', type: 'number', currency: true },
    { columnName: 'expenseAmount', type: 'number', currency: true },
  ])

  const filterProps = {
    dispatch,
    history,
  }

  const gridProps = {
    ...filterProps,
    pack,
    namespace: pack.namespace,
    list: pack.list || [],
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
  connect(({ pack }) => ({
    pack,
  })),
)(Package)
