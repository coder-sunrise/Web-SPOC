import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import { CardContainer, CommonModal, withSettingBase } from '@/components'
import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingClinicOperationHour }) => ({
  settingClinicOperationHour,
}))
@withSettingBase({ modelName: 'settingClinicOperationHour' })
class ClinicOperationHour extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingClinicOperationHour/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingClinicOperationHour/updateState',
      payload: {
        showModal: !this.props.settingClinicOperationHour.showModal,
      },
    })
  }

  render () {
    const {
      classes,
      settingClinicOperationHour,
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
          open={settingClinicOperationHour.showModal}
          observe='ClinicOperationHourDetail'
          title={
            settingClinicOperationHour.entity ? (
              'Edit Clinic Operation Hour'
            ) : (
              'Add Clinic Operation Hour'
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

export default withStyles(styles, { withTheme: true })(ClinicOperationHour)
