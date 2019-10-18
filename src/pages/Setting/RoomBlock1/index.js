import React, { PureComponent } from 'react'
import { connect } from 'dva'

import { withStyles, Divider } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingRoomBlock, global }) => ({
  settingRoomBlock,
  global,
}))
class RoomBlock extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingRoomBlock/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingRoomBlock/updateState',
      payload: {
        showModal: !this.props.settingRoomBlock.showModal,
      },
    })
  }

  render () {
    const {
      classes,
      settingRoomBlock,
      dispatch,
      theme,
      ...restProps
    } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />
        <CommonModal
          open={settingRoomBlock.showModal}
          observe='RoomDetail'
          title={settingRoomBlock.entity ? 'Edit Room Block' : 'Add Room Block'}
          maxWidth='sm'
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

export default withStyles(styles, { withTheme: true })(RoomBlock)
