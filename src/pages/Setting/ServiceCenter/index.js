import React, { PureComponent } from 'react'
import { connect } from 'dva'

import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingServiceCenter, global }) => ({
  settingServiceCenter,
  global,
}))
class ServiceCenter extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingServiceCenter/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingServiceCenter/updateState',
      payload: {
        showModal: !this.props.settingServiceCenter.showModal,
      },
    })
  }

  render () {
    const { settingServiceCenter, dispatch } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />
        <CommonModal
          open={settingServiceCenter.showModal}
          observe='ServiceCenterDetail'
          title={settingServiceCenter.entity ? 'Edit Service Center' : 'Add Service Center'} 
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
