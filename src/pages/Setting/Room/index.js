import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles, Divider } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal, withSettingBase } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = theme => ({
  ...basicStyle(theme),
})

@connect(({ settingRoom, global }) => ({
  settingRoom,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingRoom' })
class Room extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingRoom/query',
      payload: {
        isActive: true,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingRoom/updateState',
      payload: {
        showModal: !this.props.settingRoom.showModal,
      },
    })
  }

  render() {
    const { settingRoom, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height = mainDivHeight - 120 - ($('.filterRoomBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterRoomBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...this.props} height={height} />
        <CommonModal
          open={settingRoom.showModal}
          observe='RoomDetail'
          title={settingRoom.entity ? 'Edit Room' : 'Add Room'}
          maxWidth='md'
          bodyNoPadding
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
        >
          <Detail {...this.props} />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Room)
