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

@connect(({ settingMedicationFrequency }) => ({
  settingMedicationFrequency,
}))
@withSettingBase({ modelName: 'settingMedicationFrequency' })
class ServiceCenter extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingMedicationFrequency/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingMedicationFrequency/updateState',
      payload: {
        showModal: !this.props.settingMedicationFrequency.showModal,
      },
    })
  }

  render () {
    const { settingMedicationFrequency } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />
        <CommonModal
          open={settingMedicationFrequency.showModal}
          observe='MedicationFrequencyDetail'
          title={
            settingMedicationFrequency.entity ? (
              'Edit Medication Frequency'
            ) : (
              'Add Medication Frequency'
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

export default withStyles(styles, { withTheme: true })(ServiceCenter)
