import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import { CardContainer, CommonModal, withSettingBase } from '@/components'
import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingPackage }) => ({
  settingPackage,
}))
@withSettingBase({ modelName: 'settingPackage' })
class Package extends PureComponent {
  componentDidMount () {
    this.props.dispatch({
      type: 'settingPackage/query',
      payload: {
        isUserMaintainable: true,
        // sorting: [
        //   { columnName: 'effectiveEndDate', direction: 'desc' },
        //   { columnName: 'displayValue', direction: 'asc' },
        // ],
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

  render () {
    const { settingPackage } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }

    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} toggleModal={this.toggleModal} />
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
