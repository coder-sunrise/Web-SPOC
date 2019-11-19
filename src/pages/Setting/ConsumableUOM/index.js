import React, { PureComponent } from 'react'
import { connect } from 'dva'

import { withStyles, Divider } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal, withSettingBase } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingConsumableUOM }) => ({
  settingConsumableUOM,
}))
@withSettingBase({ modelName: 'settingConsumableUOM' })
class ConsumableUOM extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingConsumableUOM/query',
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

  render () {
    const {
      classes,
      settingConsumableUOM,
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
          open={settingConsumableUOM.showModal}
          observe='ConsumableUOMDetail'
          title={
            settingConsumableUOM.entity ? (
              'Edit Consumable UOM'
            ) : (
              'Add Consumable UOM'
            )
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
