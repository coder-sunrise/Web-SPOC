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

@connect(({ settingDrugAllergyExtension, global }) => ({
  settingDrugAllergyExtension,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingDrugAllergyExtension' })
class DrugAllergyExtension extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingDrugAllergyExtension/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingDrugAllergyExtension/updateState',
      payload: {
        showModal: !this.props.settingDrugAllergyExtension.showModal,
      },
    })
  }

  render () {
    const { settingDrugAllergyExtension, mainDivHeight = 700 } = this.props
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
          open={settingDrugAllergyExtension.showModal}
          observe='DrugAllergyExtensionDetail'
          title={settingDrugAllergyExtension.entity ? 'Edit Drug Allergy Extension' : 'Add Drug Allergy Extension'}
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

export default withStyles(styles, { withTheme: true })(DrugAllergyExtension)
