import React, { PureComponent } from 'react'
import { connect } from 'dva'

import { withStyles, Divider } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal, withSettingBase } from '@/components'

import Filter from './filter'
import Grid from './grid'
import Detail from './detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingRoom }) => ({
  settingRoom,
}))
@withSettingBase({ modelName: 'settingRoom' })
class TreatmentCategory extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingRoom/query',
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

  render () {
    const { classes, settingRoom, dispatch, theme, ...restProps } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }

    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...this.props} />
        <CommonModal
          open={settingRoom.showModal}
          observe='TreatmentCategoryDetail'
          title={settingRoom.entity ? 'Edit Treatment Category' : 'Add Treatment Category'}
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

export default withStyles(styles, { withTheme: true })(TreatmentCategory)
