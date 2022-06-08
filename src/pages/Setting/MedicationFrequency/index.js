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

@connect(({ settingMedicationFrequency, global, clinicSettings }) => ({
  settingMedicationFrequency,
  mainDivHeight: global.mainDivHeight,
  clinicSettings: clinicSettings.settings || clinicSettings.default,
}))
@withSettingBase({ modelName: 'settingMedicationFrequency' })
class ServiceCenter extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingMedicationFrequency/query',
      payload: {
        isActive: true,
      },
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

  render() {
    const { settingMedicationFrequency, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 120 - ($('.filterMedicationFrequencyBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterMedicationFrequencyBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={settingMedicationFrequency.showModal}
          observe='MedicationFrequencyDetail'
          title={
            settingMedicationFrequency.entity
              ? 'Edit Medication Frequency'
              : 'Add Medication Frequency'
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
