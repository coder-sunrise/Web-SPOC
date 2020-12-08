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

@connect(({ settingInvoiceAdjustment }) => ({
  settingInvoiceAdjustment,
}))
@withSettingBase({ modelName: 'settingInvoiceAdjustment' })
class InvoiceAdjustment extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingInvoiceAdjustment/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingInvoiceAdjustment/updateState',
      payload: {
        showModal: !this.props.settingInvoiceAdjustment.showModal,
      },
    })
  }

  render () {
    const { classes, settingInvoiceAdjustment, dispatch, theme, ...restProps } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }

    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...this.props} />
        <CommonModal
          open={settingInvoiceAdjustment.showModal}
          observe='InvoiceAdjustmentDetail'
          title={settingInvoiceAdjustment.entity ? 'Edit Invoice Adjustment' : 'Add Invoice Adjustment'}
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

export default withStyles(styles, { withTheme: true })(InvoiceAdjustment)
