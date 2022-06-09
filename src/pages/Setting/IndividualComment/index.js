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

@connect(({ settingIndividualComment, codetable, global, clinicSettings }) => ({
  settingIndividualComment,
  codetable,
  mainDivHeight: global.mainDivHeight,
  clinicSettings: clinicSettings.settings || clinicSettings.default,
}))
@withSettingBase({ modelName: 'settingIndividualComment' })
class IndividualComment extends PureComponent {
  state = {
    currentPayload: {},
  }
  componentDidMount() {
    this.fetchCodes()
  }
  fetchCodes = async () => {
    const { dispatch } = this.props
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctexaminationcategory',
      },
    })
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctexaminationitem',
        force: true,
      },
    }).then(() => {
      dispatch({
        type: 'settingIndividualComment/query',
      })
    })
  }

  onQuery = payload => {
    this.setState({ currentPayload: payload })
  }
  toggleModal = () => {
    this.props.dispatch({
      type: 'settingIndividualComment/updateState',
      payload: {
        showModal: !this.props.settingIndividualComment.showModal,
      },
    })
    this.props.dispatch({
      type: 'settingIndividualComment/query',
      payload: this.state.currentPayload,
    })
  }

  render() {
    const { settingIndividualComment, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 120 - ($('.filterIndividualCommentBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterIndividualCommentBar'>
          <Filter {...cfg} {...this.props} onQuery={this.onQuery} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={settingIndividualComment.showModal}
          observe='IndividualCommentDetail'
          title={
            settingIndividualComment.entity
              ? 'Edit Individual Comment'
              : 'Add Individual Comment'
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

export default withStyles(styles, { withTheme: true })(IndividualComment)
