import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core/styles'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import { CardContainer, CommonModal, withSettingBase } from '@/components'
import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = theme => ({
  ...basicStyle(theme),
})

@connect(({ settingPackage, global }) => ({
  settingPackage,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingPackage' })
class Package extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'settingPackage/query',
      payload: {
        isUserMaintainable: true,
        isActive: true,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingPackage/updateState',
      payload: {
        showModal: !this.props.settingPackage.showModal,
      },
    })
  }

  render() {
    const { settingPackage, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height = mainDivHeight - 120 - ($('.filterPackageBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterPackageBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={settingPackage.showModal}
          observe='PackageDetail'
          title={settingPackage.entity ? 'Edit Package' : 'Add Package'}
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

export default withStyles(styles, { withTheme: true })(Package)
