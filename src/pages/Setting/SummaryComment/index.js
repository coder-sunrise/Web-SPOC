import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import {
  CardContainer,
  CommonModal,
  withSettingBase,
  CodeSelect,
} from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = theme => ({
  ...basicStyle(theme),
})

@connect(({ settingSummaryComment, global, clinicSettings }) => ({
  settingSummaryComment,
  mainDivHeight: global.mainDivHeight,
  clinicSettings: clinicSettings.settings || clinicSettings.default,
}))
@withSettingBase({ modelName: 'settingSummaryComment' })
class SummaryComment extends PureComponent {
  state = {}
  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctsummarycommentcategory',
      },
    })
    dispatch({
      type: 'settingSummaryComment/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingSummaryComment/updateState',
      payload: {
        showModal: !this.props.settingSummaryComment.showModal,
      },
    })
  }

  render() {
    const { settingSummaryComment, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 120 - ($('.filterSummaryCommentBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterSummaryCommentBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={settingSummaryComment.showModal}
          observe='SummaryCommentDetail'
          title={
            settingSummaryComment.entity
              ? 'Edit Summary Comment'
              : 'Add Summary Comment'
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

export default withStyles(styles, { withTheme: true })(SummaryComment)
