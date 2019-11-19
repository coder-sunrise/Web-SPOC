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

@connect(({ settingMedicationPrecautions }) => ({
  settingMedicationPrecautions,
}))
@withSettingBase({ modelName: 'settingMedicationPrecautions' })
class ServiceCenter extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingMedicationPrecautions/query',
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

  render () {
    const { settingMedicationPrecautions } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />
        <CommonModal
          open={settingMedicationPrecautions.showModal}
          observe='MedicationPrecautionsDetail'
          title={
            settingMedicationPrecautions.entity ? (
              'Edit Medication Precaution'
            ) : (
              'Add Medication Precaution'
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
