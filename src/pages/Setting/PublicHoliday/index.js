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

@connect(({ settingPublicHoliday, global }) => ({
  settingPublicHoliday,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingPublicHoliday' })
class PublicHoliday extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingPublicHoliday/query',
      payload: {
        isActive: true,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingPublicHoliday/updateState',
      payload: {
        showModal: !this.props.settingPublicHoliday.showModal,
      },
    })
  }

  render() {
    const { settingPublicHoliday, mainDivHeight = 700 } = this.props

    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 120 - ($('.filterPublicHolidayBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterPublicHolidayBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={settingPublicHoliday.showModal}
          observe='PublicHolidayDetail'
          title={
            settingPublicHoliday.entity
              ? 'Edit Public Holiday'
              : 'Add Public Holiday'
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

export default withStyles(styles, { withTheme: true })(PublicHoliday)
