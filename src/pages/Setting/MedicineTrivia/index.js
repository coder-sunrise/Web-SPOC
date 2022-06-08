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

@connect(({ settingMedicineTrivia, global, clinicSettings }) => ({
  settingMedicineTrivia,
  mainDivHeight: global.mainDivHeight,
  clinicSettings: clinicSettings.settings || clinicSettings.default,
}))
@withSettingBase({ modelName: 'settingMedicineTrivia' })
class MedicineTrivia extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingMedicineTrivia/query',
      payload: {
        sorting: [
          { columnName: 'isDefault', direction: 'desc' },
          { columnName: 'updateDate', direction: 'desc' },
        ],
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingMedicineTrivia/updateState',
      payload: {
        showModal: !this.props.settingMedicineTrivia.showModal,
      },
    })
  }

  render() {
    const { settingMedicineTrivia, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 120 - ($('.filterMedicineTriviaBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterMedicineTriviaBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={settingMedicineTrivia.showModal}
          observe='MedicineTriviaDetail'
          title={
            settingMedicineTrivia.entity
              ? 'Edit Medicine Trivia'
              : 'Add Medicine Trivia'
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

export default withStyles(styles, { withTheme: true })(MedicineTrivia)
