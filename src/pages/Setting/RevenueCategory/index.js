import React, { PureComponent } from 'react'
import { connect } from 'dva'

import { withStyles, Divider } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal, withSettingBase } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingRevenue }) => ({
  settingRevenue,
}))
@withSettingBase({ modelName: 'settingRevenue' })
class RevenueCategory extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingRevenue/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingRevenue/updateState',
      payload: {
        showModal: !this.props.settingRevenue.showModal,
      },
    })
  }

  render () {
    const {
      classes,
      settingRevenue,
      dispatch,
      theme,
      ...restProps
    } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }

    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />

        <CommonModal
          open={settingRevenue.showModal}
          observe='RevenueDetail'
          title={
            settingRevenue.entity ? (
              'Edit Revenue Category'
            ) : (
              'Add Revenue Category'
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

export default withStyles(styles, { withTheme: true })(RevenueCategory)
