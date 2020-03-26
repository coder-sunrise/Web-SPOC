import React, { PureComponent } from 'react'
import { connect } from 'dva'

import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, withSettingBase } from '@/components'

import Grid from './Grid'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingRoomAssignment }) => ({
  settingRoomAssignment,
}))
@withSettingBase({ modelName: 'settingRoomAssignment' })
class RoomAssignment extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingRoomAssignment/query',
    })
  }

  render () {
    return (
      <CardContainer hideHeader>
        <Grid {...this.props} />
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(RoomAssignment)
