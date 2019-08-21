import React, { PureComponent } from 'react'
import { connect } from 'dva'

import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingTemplateMessage, global }) => ({
  settingTemplateMessage,
  global,
}))
class ServiceCenter extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingTemplateMessage/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingTemplateMessage/updateState',
      payload: {
        showModal: !this.props.settingTemplateMessage.showModal,
      },
    })
  }

  getModalTitle = (isEntityEmpty) => {
    const pathname = window.location.pathname.trim().toLowerCase()

    const modalTitle =
      pathname == '/setting/smstemplate'
        ? 'SMS Template'
        : 'Referral Letter Template'

    return (isEntityEmpty ? 'Edit ' : 'Add ') + modalTitle
  }

  render () {
    const { settingTemplateMessage } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />
        <CommonModal
          open={settingTemplateMessage.showModal}
          observe='TemplateMessageDetail'
          title={this.getModalTitle(settingTemplateMessage.entity)}
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
