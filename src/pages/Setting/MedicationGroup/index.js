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

@connect(({ settingMedicationGroup, global }) => ({
  settingMedicationGroup,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingMedicationGroup' })
class MedicationGroup extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingMedicationGroup/query',
      payload: {
        isActive: true,
      },
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

  render() {
    const { settingMedicationGroup, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 120 - ($('.filterMedicationGroupBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterMedicationGroupBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />

        <CommonModal
          open={settingMedicationGroup.showModal}
          observe='MedicationGroupDetail'
          title={
            settingMedicationGroup.entity
              ? 'Edit Medication Group'
              : 'Add Medication Group'
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
