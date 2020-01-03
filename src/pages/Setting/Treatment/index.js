import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import Yup from '@/utils/yup'
import { CardContainer, CommonModal, withSettingBase } from '@/components'
import Filter from './filter'
import Grid from './grid'
import Detail from './detail'

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
@withSettingBase({ modelName: 'settingClinicService' })
class TreatmentService extends PureComponent {
  state = { open: false }

  componentDidMount () {
    this.props.dispatch({
      type: 'settingClinicService/query',
      payload: {},
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
          observe='TreatmentModal'
          title={settingClinicService.entity ? 'Edit Treatment' : 'Add Treatment'}
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

export default withStyles(styles, { withTheme: true })(TreatmentService)
