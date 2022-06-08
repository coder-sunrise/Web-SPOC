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

@connect(({ settingTreatment, codetable, global }) => ({
  settingTreatment,
  codetable,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingTreatment' })
class Treatment extends PureComponent {
  state = {}

  constructor(props) {
    super(props)
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctchartmethod',
      },
    })
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'settingTreatment/query',
      payload: {
        isActive: true,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingTreatment/updateState',
      payload: {
        showModal: !this.props.settingTreatment.showModal,
      },
    })
  }

  render() {
    const { settingTreatment, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height = mainDivHeight - 120 - ($('.filterTreatmentBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterTreatmentBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...this.props} height={height} />
        <CommonModal
          open={settingTreatment.showModal}
          observe='TreatmentDetail'
          title={settingTreatment.entity ? 'Edit Treatment' : 'Add Treatment'}
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

export default withStyles(styles, { withTheme: true })(Treatment)
