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

@connect(({ settingConsumableUOM, global }) => ({
  settingConsumableUOM,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingConsumableUOM' })
class ConsumableUOM extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingConsumableUOM/query',
      payload: {
        isActive: true,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingConsumableUOM/updateState',
      payload: {
        showModal: !this.props.settingConsumableUOM.showModal,
      },
    })
  }

  render() {
    const { settingConsumableUOM, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 120 - ($('.filterConsumableUOMBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterConsumableUOMBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />

        <CommonModal
          open={settingConsumableUOM.showModal}
          observe='ConsumableUOMDetail'
          title={
            settingConsumableUOM.entity
              ? 'Edit Ophthalmic Product UOM'
              : 'Add Ophthalmic Product UOM'
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

export default withStyles(styles, { withTheme: true })(ConsumableUOM)
