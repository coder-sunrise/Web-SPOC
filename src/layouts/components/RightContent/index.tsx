/* eslint-disable guard-for-in */
import React from 'react'
import { connect } from 'dva'
// antd
import { Divider } from 'antd'
import _ from 'lodash'

import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Person from '@material-ui/icons/Person'
import WifiOff from '@material-ui/icons/WifiOff'
// common components
import { Badge, SizeContainer, Popper, Button, Tooltip } from '@/components'
// subcomponents
import { Notification } from '@/components/_medisys'
// utils
import { updateAPIType } from '@/utils/request'
import { navigateDirtyCheck } from '@/utils/utils'
import styles from './index.less'
import { APPNOTIFICATION_SCHEMA } from '@/utils/constants'

@connect(({ user, clinicInfo, header, codetable }) => ({
  user,
  clinicInfo,
  header,
  codetable,
}))
class HeaderLinks extends React.Component {
  state = {
    openNotification: false,
    openAccount: false,
    openDomain: false,
    title: 'PROD',
  }

  handleClick = key => () => {
    this.setState(preState => ({ [`open${key}`]: !preState[`open${key}`] }))
  }

  handleClose = (key, cb) => () => {
    this.setState({ [`open${key}`]: false })
    if (cb) cb()
  }

  onLogoutClick = event => {
    this.setState({
      openAccount: false,
    })

    const {
      route: { routes },
    } = this.props
    const rt =
      routes
        .map(o => o.routes || [])
        .reduce((a, b) => {
          return a.concat(b)
        }, [])
        .find(o => location.pathname === o.path) || {}

    navigateDirtyCheck({
      onProceed: () =>
        this.props.dispatch({
          type: 'login/logout',
        }),
      displayName: rt.observe,
    })(event)
  }

  openUserProfileForm = () => {
    const { dispatch, user } = this.props
    user.data &&
      dispatch({
        type: 'user/fetchProfileDetails',
        id: user.data.clinicianProfile.id,
      })
    dispatch({
      type: 'global/updateAppState',
      payload: {
        showUserProfile: true,
        accountModalTitle: 'My Account',
      },
    })
  }

  openChangePasswordForm = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'global/updateState',
      payload: {
        showChangePasswordModal: true,
      },
    })
  }

  updateAPIType(type) {
    updateAPIType(type)
  }

  render() {
    const { rtlActive, user, clinicInfo, header, codetable } = this.props
    const { openAccount } = this.state
    const { signalRConnected, notifications } = header
    const { ctroom = [] } = codetable

    const name =
      user.data && user.data.clinicianProfile
        ? user.data.clinicianProfile.name
        : ''
    const userTitle =
      user.data && user.data.clinicianProfile
        ? user.data.clinicianProfile.title
        : ''

    const clinicShortCode = clinicInfo ? clinicInfo.clinicShortCode : ''

    const roomCode = localStorage.getItem('roomCode')
    let roomDisplayValue = null

    if (roomCode && ctroom.length !== 0) {
      const room = ctroom?.find(room => room.code === roomCode)
      roomDisplayValue = room.name
    }

    return (
      <div>
        <div>
          <SizeContainer size='lg'>
            <div>
              <Notification
                dispatch={this.props.dispatch}
                notifications={notifications}
              />
              {!signalRConnected && (
                <Tooltip title='Real-time update signal is down. Please refresh manually.'>
                  <Button justIcon color='transparent'>
                    <Badge
                      ripple
                      color='danger'
                      overlap='circle'
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      variant='dot'
                    >
                      <WifiOff />
                    </Badge>
                  </Button>
                </Tooltip>
              )}
              <Popper
                overlay={
                  <MenuList role='menu'>
                    <MenuItem onClick={this.openUserProfileForm}>
                      My Account
                    </MenuItem>
                    <MenuItem onClick={this.openChangePasswordForm}>
                      Change Password
                    </MenuItem>
                    <MenuItem onClick={this.onLogoutClick}>Logout</MenuItem>
                  </MenuList>
                }
              >
                <Button
                  justIcon
                  color='transparent'
                  aria-label='Person'
                  aria-haspopup='true'
                  aria-owns={openAccount ? 'menu-list' : null}
                >
                  <Person />
                  <span>
                    {userTitle} {name}
                  </span>
                </Button>
              </Popper>
              {roomDisplayValue && (
                <span>
                  <Divider
                    type='vertical'
                    style={{ background: '#999', height: '1.2rem' }}
                  />
                  <div className={styles.roomDisplayValue}>
                    <span>{roomDisplayValue}</span>
                  </div>
                </span>
              )}
              <Divider
                type='vertical'
                style={{ background: '#999', height: '1.2rem' }}
              />
              <div className={styles.clinicShortCode}>
                <span>{clinicShortCode}</span>
              </div>
            </div>
          </SizeContainer>
        </div>
      </div>
    )
  }
}

export default HeaderLinks
