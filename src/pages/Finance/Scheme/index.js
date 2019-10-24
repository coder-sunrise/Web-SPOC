import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { CardContainer } from '@/components'
import { compose } from 'redux'
import FilterBar from './FilterBar'
import Grid from './Grid'
import Authorized from '@/utils/Authorized'

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
    <Authorized authority='scheme.schemedetails'>
      <CardContainer
        hideHeader
        style={{
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <FilterBar {...props} />
        <Grid {...props} />
      </CardContainer>
    </Authorized>
  )
}

export default compose(
  withStyles(styles),
  React.memo,
  connect(({ copaymentScheme }) => ({
    copaymentScheme,
  })),
)(Scheme)
