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

@connect(({ settingConsumableGroup, global }) => ({
  settingConsumableGroup,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingConsumableGroup' })
class ConsumableGroup extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingConsumableGroup/query',
      payload: {
        isActive: true,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingConsumableGroup/updateState',
      payload: {
        showModal: !this.props.settingConsumableGroup.showModal,
      },
    })
  }

  render() {
    const { settingConsumableGroup, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 120 - ($('.filterConsumableGroupBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterConsumableGroupBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />

        <CommonModal
          open={settingConsumableGroup.showModal}
          observe='ConsumableGroupDetail'
          title={
            settingConsumableGroup.entity
              ? 'Edit Product Category'
              : 'Add Product Category'
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

export default withStyles(styles, { withTheme: true })(ConsumableGroup)
