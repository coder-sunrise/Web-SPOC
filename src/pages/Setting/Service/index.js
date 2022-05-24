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
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingClinicService' })
class Service extends PureComponent {
  state = { open: false }

  componentDidMount() {
    this.props.dispatch({
      type: 'settingClinicService/query',
      payload: {
        'ServiceFKNavigation.isActive': true,
      },
    })
    this.props.dispatch({
      type: 'settingClinicService/getServiceCenter',
      payload: {},
    })
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctexaminationitem',
      },
    })
  }

  toggleModal = () => {
    const { dispatch } = this.props

    this.setState(prevState => {
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

  render() {
    const { settingClinicService, mainDivHeight = 700 } = this.props
    const { open } = this.state
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height = mainDivHeight - 110 - ($('.filterBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid
          {...cfg}
          {...this.props}
          toggleModal={this.toggleModal}
          height={height}
        />
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
