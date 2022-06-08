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

@connect(({ settingMedicationPrecautions, global, clinicSettings }) => ({
  settingMedicationPrecautions,
  mainDivHeight: global.mainDivHeight,
  clinicSettings: clinicSettings.settings || clinicSettings.default,
}))
@withSettingBase({ modelName: 'settingMedicationPrecautions' })
class ServiceCenter extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingMedicationPrecautions/query',
      payload: {
        isActive: true,
      },
    })

    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: { code: 'ctlanguage' },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingMedicationPrecautions/updateState',
      payload: {
        showModal: !this.props.settingMedicationPrecautions.showModal,
      },
    })
  }

  render() {
    const { settingMedicationPrecautions, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 120 - ($('.filterMedicationPrecautionBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterMedicationPrecautionBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={settingMedicationPrecautions.showModal}
          observe='MedicationPrecautionsDetail'
          title={
            settingMedicationPrecautions.entity
              ? 'Edit Medication Precaution'
              : 'Add Medication Precaution'
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
