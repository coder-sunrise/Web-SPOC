import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, withSettingBase } from '@/components'

import Filter from './Filter'
import Grid from './Grid'

const styles = theme => ({
  ...basicStyle(theme),
})

@connect(({ settingServiceCenterCategory, global }) => ({
  settingServiceCenterCategory,
  global,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingServiceCenterCategory' })
class ServiceCenterCategory extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingServiceCenterCategory/query',
    })
  }

  render() {
    const { mainDivHeight = 700 } = this.props
    let height =
      mainDivHeight - 120 - ($('.filterServiceCenterCategoryBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterServiceCenterCategoryBar'>
          <Filter {...this.props} />
        </div>
        <Grid {...this.props} height={height} />
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ServiceCenterCategory)
