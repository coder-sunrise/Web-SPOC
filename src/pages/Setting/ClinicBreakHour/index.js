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

@connect(({ settingClinicBreakHour, global }) => ({
  settingClinicBreakHour,
  global,
}))
@withSettingBase({
  modelName: 'settingClinicBreakHour',
})
class ClinicBreakHour extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingClinicBreakHour/query',
    })
  }

  componentWillUnmount () {
    this.props.dispatch({
      type: 'settingClinicBreakHour/updateState',
      payload: {
        filter: {},
        list: [],
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingClinicBreakHour/updateState',
      payload: {
        showModal: !this.props.settingClinicBreakHour.showModal,
      },
    })
  }

  render () {
    const {
      classes,
      settingClinicBreakHour,
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
          open={settingClinicBreakHour.showModal}
          observe='ClinicBreakHourDetail'
          title={
            settingClinicBreakHour.entity ? (
              'Edit Clinic Break Hour'
            ) : (
              'Add Clinic Break Hour'
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

export default withStyles(styles, { withTheme: true })(ClinicBreakHour)
