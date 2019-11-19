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

@connect(({ settingServiceCategory, global }) => ({
  settingServiceCategory,
  global,
}))
@withSettingBase({ modelName: 'settingServiceCategory' })
class ServiceCategory extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingServiceCategory/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingServiceCategory/updateState',
      payload: {
        showModal: !this.props.settingServiceCategory.showModal,
      },
    })
  }

  render () {
    const { settingServiceCategory } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />
        <CommonModal
          open={settingServiceCategory.showModal}
          observe='ServiceCategoryDetail'
          title={
            settingServiceCategory.entity ? (
              'Edit Service Category'
            ) : (
              'Add Service Category'
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

export default withStyles(styles, { withTheme: true })(ServiceCategory)
