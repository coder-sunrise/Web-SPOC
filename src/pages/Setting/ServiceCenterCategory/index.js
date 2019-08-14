import React, { PureComponent } from 'react'
import { connect } from 'dva'

import { withStyles, Divider } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
//import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingServiceCenterCategory, global }) => ({
  settingServiceCenterCategory,
  global,
}))
class ServiceCenterCategory extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingServiceCenterCategory/query',
    })
  }

  render () {
    const { classes, settingServiceCenterCategory, dispatch, theme, ...restProps } = this.props

    return (
      <CardContainer hideHeader>
        <Filter {...this.props} />
        <Grid  {...this.props} />
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ServiceCenterCategory)
