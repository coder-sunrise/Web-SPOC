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

@connect(({ settingSmsTemplate }) => ({
  settingSmsTemplate,
}))
@withSettingBase({ modelName: 'settingSmsTemplate' })
class ServiceCenter extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingSmsTemplate/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingSmsTemplate/updateState',
      payload: {
        showModal: !this.props.settingSmsTemplate.showModal,
      },
    })
  }

  // getModalTitle = (isEntityEmpty) => {
  //   const pathname = window.location.pathname.trim().toLowerCase()

  //   const modalTitle =
  //     pathname == '/setting/smstemplate'
  //       ? 'SMS Template'
  //       : 'Document Template'

  //   return (isEntityEmpty ? 'Edit ' : 'Add ') + modalTitle
  // }

  render () {
    const { settingSmsTemplate } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />
        <CommonModal
          open={settingSmsTemplate.showModal}
          observe='TemplateMessageDetail'
          // title={this.getModalTitle(settingSmsTemplate.entity)}
          title={`${settingSmsTemplate.entity ? 'Edit ' : 'Add '}SMS Template`}
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
