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

@connect(({ settingRevenue, global }) => ({
  settingRevenue,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingRevenue' })
class RevenueCategory extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingRevenue/query',
      payload: {
        isActive: true,
      },
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

  render() {
    const { settingRevenue, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height = mainDivHeight - 120 - ($('.filterRevenueBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterRevenueBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />

        <CommonModal
          open={settingRevenue.showModal}
          observe='RevenueDetail'
          title={
            settingRevenue.entity
              ? 'Edit Revenue Category'
              : 'Add Revenue Category'
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
