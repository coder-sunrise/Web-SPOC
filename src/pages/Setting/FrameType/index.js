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
@connect(({ settingFrameType, global }) => ({
  settingFrameType,
  global,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingFrameType' })
class FrameType extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingFrameType/query',
      payload: {
        isActive: true,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingFrameType/updateState',
      payload: {
        showModel: !this.props.settingFrameType.showModel,
      },
    })
  }
  render() {
    const { settingFrameType, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height = mainDivHeight - 120 - ($('.filterFrameTypeBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterFrameTypeBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={settingFrameType.showModel}
          observe='FrameTypeDetail'
          title={settingFrameType.entity ? 'Edit Frame Type' : 'Add Frame Type'}
          maxWidth='md'
          bodyNoPadding
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
        >
          <Detail {...cfg} {...this.props}></Detail>
        </CommonModal>
      </CardContainer>
    )
  }
}
export default withStyles(styles, { withTheme: true })(FrameType)
