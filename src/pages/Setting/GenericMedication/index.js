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

@connect(({ settingGenericMedication, global }) => ({
  settingGenericMedication,
  global,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingGenericMedication' })
class GenericMedication extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingGenericMedication/query',
      payload: {
        isActive: true,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingGenericMedication/updateState',
      payload: {
        showModal: !this.props.settingGenericMedication.showModal,
      },
    })
  }

  render() {
    const { settingGenericMedication, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 120 - ($('.filterGenericMedicationBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterGenericMedicationBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={settingGenericMedication.showModal}
          observe='GenericMedicationDetail'
          title={
            settingGenericMedication.entity
              ? 'Edit Generic Drug'
              : 'Add Generic Drug'
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

export default withStyles(styles, { withTheme: true })(GenericMedication)
