import React, { PureComponent } from 'react'
import { connect } from 'dva'

import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer } from '@/components'

import Filter from './Filter'
import Grid from './Grid'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ queueProcessor }) => ({
  queueProcessor,
}))
class QueueProcessor extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'queueProcessor/query',
    })
  } 

  render () {  
    return (
      <CardContainer hideHeader>
        <Filter {...this.props} />
        <Grid {...this.props} /> 
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(QueueProcessor)
