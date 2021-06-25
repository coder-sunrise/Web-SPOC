import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles, Divider } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal, withSettingBase } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingClinicDrugAllergy, global }) => ({
  settingClinicDrugAllergy,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingClinicDrugAllergy' })
class ClinicDrugAllergy extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingClinicDrugAllergy/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingClinicDrugAllergy/updateState',
      payload: {
        showModal: !this.props.settingClinicDrugAllergy.showModal,
      },
    })
  }

  render () {
    const { settingClinicDrugAllergy, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height = mainDivHeight - 110 - ($('.filterBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...this.props} height={height} />
        <CommonModal
          open={settingClinicDrugAllergy.showModal}
          observe='ClinicDrugAllergyDetail'
          title={settingClinicDrugAllergy.entity ? 'Edit Clinic Drug Allergy' : 'Add Clinic Drug Allergy'}
          maxWidth='md'
          bodyNoPadding
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
        >
          <Detail {...this.props} />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ClinicDrugAllergy)
