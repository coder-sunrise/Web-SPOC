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

@connect(({ settingTreatment }) => ({
  settingTreatment,
}))
@withSettingBase({ modelName: 'settingTreatment' })
class Treatment extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingTreatment/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingTreatment/updateState',
      payload: {
        showModal: !this.props.settingTreatment.showModal,
      },
    })
  }

  render () {
    const {
      classes,
      settingTreatment,
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
        <Grid {...this.props} />
        <CommonModal
          open={settingTreatment.showModal}
          observe='TreatmentDetail'
          title={settingTreatment.entity ? 'Edit Treatment' : 'Add Treatment'}
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

export default withStyles(styles, { withTheme: true })(Treatment)
