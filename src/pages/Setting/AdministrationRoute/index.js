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

@connect(({ settingAdministrationRoute, global, clinicSettings }) => ({
  settingAdministrationRoute,
  mainDivHeight: global.mainDivHeight,
  clinicSettings: clinicSettings.settings || clinicSettings.default,
}))
@withSettingBase({ modelName: 'settingAdministrationRoute' })
class ServiceCenter extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      payload: {
        isActive: true,
      },
      type: 'settingAdministrationRoute/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingAdministrationRoute/updateState',
      payload: {
        showModal: !this.props.settingAdministrationRoute.showModal,
      },
    })
  }

  render() {
    const { settingAdministrationRoute, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 120 - ($('.filterAdministrationRouteBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterAdministrationRouteBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={settingAdministrationRoute.showModal}
          observe='AdministrationRouteDetail'
          title={
            settingAdministrationRoute.entity
              ? 'Edit Route of Administration'
              : 'Add Route of Administration'
          }
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

export default withStyles(styles, { withTheme: true })(ServiceCenter)
