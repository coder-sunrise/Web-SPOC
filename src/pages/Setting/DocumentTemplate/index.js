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

@connect(({ settingDocumentTemplate, global }) => ({
  settingDocumentTemplate,
  global,
}))
class ServiceCenter extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingDocumentTemplate/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingDocumentTemplate/updateState',
      payload: {
        showModal: !this.props.settingDocumentTemplate.showModal,
      },
    })
  }

  // getModalTitle = (isEntityEmpty) => {
  //   const pathname = window.location.pathname.trim().toLowerCase()

  //   const modalTitle =
  //     pathname == '/setting/smstemplate'
  //       ? 'SMS Template'
  //       : 'Document Template'

  //   return `${isEntityEmpty ? 'Edit ' : 'Add '  }Document Template`
  // }
  
  render () {
    const { settingDocumentTemplate } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    } 
    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />
        <CommonModal
          open={settingDocumentTemplate.showModal}
          observe='TemplateMessageDetail'
          // title={this.getModalTitle(settingDocumentTemplate.entity)}
          title={`${settingDocumentTemplate.entity ? 'Edit ' : 'Add '  }Document Template`}
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
