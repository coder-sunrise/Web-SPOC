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

@connect(({ settingCaseDescription, global }) => ({
  settingCaseDescription,
  global,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingCaseDescription' })
class CaseDescription extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingCaseDescription/query',
      payload: {
        isActive: true,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingCaseDescription/updateState',
      payload: {
        showModal: !this.props.settingCaseDescription.showModal,
      },
    })
  }

  render() {
    const { settingCaseDescription, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 120 - ($('.filterCaseDescriptionBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterCaseDescriptionBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={settingCaseDescription.showModal}
          observe='CaseDescriptionDetail'
          title={
            settingCaseDescription.entity
              ? 'Edit Case Description'
              : 'Add Case Description'
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

export default withStyles(styles, { withTheme: true })(CaseDescription)
