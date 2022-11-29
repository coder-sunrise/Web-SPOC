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

@connect(({ settingCaseType, global }) => ({
  settingCaseType,
  global,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingCaseType' })

class CaseType extends PureComponent {
  state = {}

  componentDidMount() {
  
    this.props.dispatch({
      type: 'settingCaseType/query',
      payload: {
        isActive: true,
      },
    })
    
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingCaseType/updateState',
      payload: {
        showModal: !this.props.settingCaseType.showModal,
      },
    })
  }
  
  render() {
    const { settingCaseType, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height = mainDivHeight - 120 - ($('.filterCaseTypeBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterCaseTypeBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={settingCaseType.showModal}
          observe='CaseTypeDetail'
          title={settingCaseType.entity ? 'Edit Case Type' : 'Add Case Type'}
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

export default withStyles(styles, { withTheme: true })(CaseType)
