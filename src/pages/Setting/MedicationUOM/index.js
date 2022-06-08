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

@connect(({ settingMedicationUOM, global, clinicSettings }) => ({
  settingMedicationUOM,
  mainDivHeight: global.mainDivHeight,
  clinicSettings: clinicSettings.settings || clinicSettings.default,
}))
@withSettingBase({
  modelName: 'settingMedicationUOM',
})
class MedicationUOM extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingMedicationUOM/query',
      payload: {
        isActive: true,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingMedicationUOM/updateState',
      payload: {
        showModal: !this.props.settingMedicationUOM.showModal,
      },
    })
  }

  render() {
    const { settingMedicationUOM, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 120 - ($('.filterMedicationUOMBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterMedicationUOMBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />

        <CommonModal
          open={settingMedicationUOM.showModal}
          observe='MedicationUOMDetail'
          title={
            settingMedicationUOM.entity
              ? 'Edit Medication UOM'
              : 'Add Medication UOM'
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

export default withStyles(styles, { withTheme: true })(MedicationUOM)
