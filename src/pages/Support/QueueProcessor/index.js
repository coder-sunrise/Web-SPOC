import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer } from '@/components'

import Filter from './Filter'
import Grid from './Grid'

const styles = theme => ({
  ...basicStyle(theme),
})

@connect(({ queueProcessor, global }) => ({
  queueProcessor,
  mainDivHeight: global.mainDivHeight,
}))
class QueueProcessor extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'queueProcessor/query',
    })
  }

  render() {
    const { mainDivHeight = 700 } = this.props
    let height =
      mainDivHeight - 120 - ($('.filterQueueProcessorBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterQueueProcessorBar'>
          <Filter {...this.props} />
        </div>
        <Grid {...this.props} height={height} />
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(QueueProcessor)
