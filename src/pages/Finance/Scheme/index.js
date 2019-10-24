import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { CardContainer } from '@/components'
import { compose } from 'redux'
import FilterBar from './FilterBar'
import Grid from './Grid'

const styles = () => ({})
const Scheme = ({ classes, dispatch, history, copaymentScheme }) => {
  const props = {
    classes,
    dispatch,
    history,
    copaymentScheme,
  }
  useEffect(() => {
    dispatch({
      type: 'copaymentScheme/query',
    })
  }, [])
  return (
    <CardContainer hideHeader>
      <FilterBar {...props} />
      <Grid {...props} />
    </CardContainer>
  )
}

export default compose(
  withStyles(styles),
  React.memo,
  connect(({ copaymentScheme }) => ({
    copaymentScheme,
  })),
)(Scheme)
