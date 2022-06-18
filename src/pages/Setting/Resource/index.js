import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal, withSettingBase } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = theme => ({
  ...basicStyle(theme),
})

@connect(({ settingResource, global, calendarResource, clinicSettings }) => ({
  settingResource,
  global,
  mainDivHeight: global.mainDivHeight,
  calendarResource,
  clinicSettings: clinicSettings.settings,
}))
@withSettingBase({ modelName: 'settingResource' })
class Resource extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingResource/query',
      payload: {
        isActive: true,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingResource/updateState',
      payload: {
        showModal: !this.props.settingResource.showModal,
      },
    })
    this.props.dispatch({
      type: 'settingResource/query',
    })
  }

  render() {
    const { settingResource, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height = mainDivHeight - 120 - ($('.filterResourceBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterResourceBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={settingResource.showModal}
          observe='ResourceDetail'
          title={settingResource.entity ? 'Edit Resource' : 'Add Resource'}
          maxWidth='md'
          bodyNoPadding
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
        >
          <Detail {...cfg} {...this.props} />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Resource)
