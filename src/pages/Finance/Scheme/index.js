import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core/styles'
import { CardContainer } from '@/components'
import FilterBar from './FilterBar'
import Grid from './Grid'

const styles = () => ({})
const Scheme = ({
  classes,
  dispatch,
  history,
  copaymentScheme,
  mainDivHeight = 700,
}) => {
  const props = {
    classes,
    dispatch,
    history,
    copaymentScheme,
  }
  useEffect(() => {
    dispatch({
      payload: {
        isActive:true,
      },
      type: 'copaymentScheme/query',
    })
  }, [])

  let height = mainDivHeight - 110 - ($('.filterBar').height() || 0)
  if (height < 300) height = 300
  return (
    <CardContainer hideHeader>
      <div className='filterBar'>
        <FilterBar {...props} />
      </div>
      <Grid {...props} height={height} />
    </CardContainer>
  )
}

export default compose(
  withStyles(styles),
  React.memo,
  connect(({ copaymentScheme, global }) => ({
    copaymentScheme,
    mainDivHeight: global.mainDivHeight,
  })),
)(Scheme)
