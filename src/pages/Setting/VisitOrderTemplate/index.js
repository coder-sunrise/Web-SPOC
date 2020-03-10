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

@connect(({ settingVisitOrderTemplate }) => ({
  settingVisitOrderTemplate,
}))
@withSettingBase({ modelName: 'settingVisitOrderTemplate' })
class VisitOrderTemplate extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingVisitOrderTemplate/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingVisitOrderTemplate/updateState',
      payload: {
        showModal: !this.props.settingVisitOrderTemplate.showModal,
      },
    })
  }

  render () {
    const { settingVisitOrderTemplate } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }

    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...this.props} />
        <CommonModal
          open={settingVisitOrderTemplate.showModal}
          observe='VisitOrderTemplateDetail'
          title={
            settingVisitOrderTemplate.entity ? (
              'Edit Visit Order Template'
            ) : (
              'Add Visit Order Template'
            )
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

export default withStyles(styles, { withTheme: true })(VisitOrderTemplate)
