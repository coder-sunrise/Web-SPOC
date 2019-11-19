import React, { PureComponent } from 'react'
import { connect } from 'dva'

import { withStyles, Divider } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal, withSettingBase } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingMedicationGroup }) => ({
  settingMedicationGroup,
}))
@withSettingBase({ modelName: 'settingMedicationGroup' })
class MedicationGroup extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingMedicationGroup/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingMedicationGroup/updateState',
      payload: {
        showModal: !this.props.settingMedicationGroup.showModal,
      },
    })
  }

  render () {
    const {
      classes,
      settingMedicationGroup,
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
          open={settingMedicationGroup.showModal}
          observe='MedicationGroupDetail'
          title={
            settingMedicationGroup.entity ? (
              'Edit Medication Group'
            ) : (
              'Add Medication Group'
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

export default withStyles(styles, { withTheme: true })(MedicationGroup)
