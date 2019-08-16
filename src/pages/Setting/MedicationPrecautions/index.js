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

@connect(({ settingMedicationPrecautions, global }) => ({
  settingMedicationPrecautions,
  global,
}))
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
    const { classes, settingMedicationPrecautions, dispatch, theme, ...restProps } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />
        <CommonModal
          open={settingMedicationPrecautions.showModal}
          observe='MedicationPrecautionDetail'
          title={settingMedicationPrecautions.entity ? 'Edit Medication Precautions' : 'Add Medication Precautions'} 
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
