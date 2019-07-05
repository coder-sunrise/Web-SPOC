import React from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { CardContainer } from '@/components'
import { compose } from 'redux'
import FilterBar from './FilterBar'
import Grid from './Grid'

const styles = () => ({})
const Scheme = ({ classes, dispatch, history, scheme }) => {
  const props = {
    classes,
    dispatch,
    history,
    scheme,
  }
  return (
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
  )
}

export default compose(
  withStyles(styles),
  React.memo,
  connect(({ scheme }) => ({
    scheme,
  })),
)(Scheme)
