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

@connect(({ settingSmsTemplate, global }) => ({
  settingSmsTemplate,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingSmsTemplate' })
class SMSTemplate extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingSmsTemplate/query',
      payload: {
        isActive: true,
      },
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

  render() {
    const { settingSmsTemplate, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 120 - ($('.filterTemplateMessageBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterTemplateMessageBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={settingSmsTemplate.showModal}
          observe='TemplateMessageDetail'
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

export default withStyles(styles, { withTheme: true })(SMSTemplate)
