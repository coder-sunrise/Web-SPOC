import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import { connect } from 'dva'

import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
  detailHeaderContainer: { position: 'relative', lineHeight: '45px' },
  detailHeader: {
    fontWeight: 500,
    marginTop: theme.spacing(1),
    '&:first-of-type': {
      marginTop: 0,
    },
  },
  medisaveCheck: { position: 'absolute', zIndex: 1, top: 11, width: 20 },
})

@connect(({ settingClinicService, global }) => ({
  settingClinicService,
  global,
}))
class Service extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingClinicService/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingClinicService/updateState',
      payload: {
        showModal: !this.props.settingClinicService.showModal,
      },
    })
  }

  render () {
    const { settingClinicService } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }

    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />
        <CommonModal
          open={settingClinicService.showModal}
          observe='ServiceModal'
          title={settingClinicService.entity ? 'Edit Service' : 'Add Service'}
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

export default withStyles(styles, { withTheme: true })(Service)
