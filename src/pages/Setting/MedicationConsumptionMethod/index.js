import React, { PureComponent } from 'react'
import { connect } from 'dva'

import { withStyles, Divider } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingMedicationConsumptionMethod, global }) => ({
  settingMedicationConsumptionMethod,
  global,
}))
class ServiceCenter extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingMedicationConsumptionMethod/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingMedicationConsumptionMethod/updateState',
      payload: {
        showModal: !this.props.settingMedicationConsumptionMethod.showModal,
      },
    })
  }

  render () {
    const { classes, settingMedicationConsumptionMethod, dispatch, theme, ...restProps } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />
        <CommonModal
          open={settingMedicationConsumptionMethod.showModal}
          observe='MedicationConsumptionMethodDetail'
          title={settingMedicationConsumptionMethod.entity ? 'Edit Medication Precautions' : 'Add Medication Precautions'} 
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
