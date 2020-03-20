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

@connect(({ settingTreatmentCategory, global }) => ({
  settingTreatmentCategory,
  global,
}))
@withSettingBase({ modelName: 'settingTreatmentCategory' })
class TreatmentCategory extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingTreatmentCategory/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingTreatmentCategory/updateState',
      payload: {
        showModal: !this.props.settingTreatmentCategory.showModal,
      },
    })
  }

  render() {
    const { settingTreatmentCategory } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />
        <CommonModal
          open={settingTreatmentCategory.showModal}
          observe='TreatmentCategoryDetail'
          title={
            settingTreatmentCategory.entity ? (
              'Edit Treatment Category'
            ) : (
                'Add Treatment Category'
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

export default withStyles(styles, { withTheme: true })(TreatmentCategory)