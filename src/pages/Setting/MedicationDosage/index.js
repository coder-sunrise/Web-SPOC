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

@connect(({ settingMedicationDosage, global }) => ({
  settingMedicationDosage,
  global,
}))
class MedicationDosage extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingMedicationDosage/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingMedicationDosage/updateState',
      payload: {
        showModal: !this.props.settingMedicationDosage.showModal,
      },
    })
  }

  render () {
    const {
      classes,
      settingMedicationDosage,
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
          open={settingMedicationDosage.showModal}
          observe='MedicationDosageDetail'
          title={
            settingMedicationDosage.entity ? (
              'Edit Medication Dosage'
            ) : (
              'Add Medication Dosage'
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

export default withStyles(styles, { withTheme: true })(MedicationDosage)
