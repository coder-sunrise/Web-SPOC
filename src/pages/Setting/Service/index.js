import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import Yup from '@/utils/yup'
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
  state = { open: false }

  componentDidMount () {
    this.props.dispatch({
      type: 'settingClinicService/query',
    })
  }

  toggleModal = () => {
    const { dispatch } = this.props
    // dispatch({
    //   type: 'settingClinicService/updateState',
    //   payload: {
    //     showModal: !this.props.settingClinicService.showModal,
    //   },
    // })

    this.setState((prevState) => {
      return { open: !prevState.open }
    })

    if (this.state.open) {
      dispatch({
        type: 'global/updateState',
        payload: {
          disableSave: false,
        },
      })
    }

  }

  render () {
    const { settingClinicService } = this.props
    const { open } = this.state
    const cfg = {
      toggleModal: this.toggleModal,
    }

    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} toggleModal={this.toggleModal} />
        <CommonModal
          open={open}
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
