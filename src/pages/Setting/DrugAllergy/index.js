import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles, Divider } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal, withSettingBase } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = theme => ({
  ...basicStyle(theme),
})

@connect(({ settingDrugAllergy, global }) => ({
  settingDrugAllergy,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingDrugAllergy' })
class DrugAllergy extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ltdrugallergysource',
      },
    })

    this.props.dispatch({
      type: 'settingDrugAllergy/query',
      payload: {
        isActive:true,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingDrugAllergy/updateState',
      payload: {
        showModal: !this.props.settingDrugAllergy.showModal,
      },
    })
  }

  render() {
    const { settingDrugAllergy, mainDivHeight = 700 } = this.props
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
          open={settingDrugAllergy.showModal}
          observe='DrugAllergyDetail'
          title={
            settingDrugAllergy.entity ? 'Edit Drug Allergy' : 'Add Drug Allergy'
          }
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

export default withStyles(styles, { withTheme: true })(DrugAllergy)
