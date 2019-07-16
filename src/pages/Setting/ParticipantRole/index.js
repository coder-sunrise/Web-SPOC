import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import {
  CardContainer,
  CommonModal,
} from '@/components'
import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingParticipantRole }) => ({
    settingParticipantRole,
}))
class ParticipantRole extends PureComponent {
  state = {}

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingParticipantRole/updateState',
      payload: {
        showModal: !this.props.settingParticipantRole.showModal,
      },
    })
  }

  render () {
    const {
      classes,
      settingParticipantRole,
      dispatch,
      theme,
      ...restProps
    } = this.props

    const cfg = {
      toggleModal: this.toggleModal,
    }

    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />
        <CommonModal
          open={settingParticipantRole.showModal}
          title='Add Participant Role'
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

export default withStyles(styles, { withTheme: true })(ParticipantRole)
