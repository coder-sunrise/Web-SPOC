import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
// import { Manager, Target, Popper } from "react-popper";
// dva
import { connect } from 'dva'
import { Divider } from 'antd'
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Paper from '@material-ui/core/Paper'
import Grow from '@material-ui/core/Grow'
import Hidden from '@material-ui/core/Hidden'

// @material-ui/icons
import Person from '@material-ui/icons/Person'
import Notifications from '@material-ui/icons/Notifications'
import Link from '@material-ui/icons/Link'
import LinkOff from '@material-ui/icons/LinkOff'
import WifiOff from '@material-ui/icons/WifiOff'
import Search from '@material-ui/icons/Search'

// core components
import CustomInput from 'mui-pro-components/CustomInput'

import headerLinksStyle from 'mui-pro-jss/material-dashboard-pro-react/components/headerLinksStyle'

import {
  Badge,
  SizeContainer,
  TextField,
  Tooltip,
  Popper,
  Button,
} from '@/components'
import { updateAPIType } from '@/utils/request'
import { navigateDirtyCheck } from '@/utils/utils'

@connect(({ user, clinicInfo, header }) => ({
  user,
  clinicInfo,
  header,
}))
class HeaderLinks extends React.Component {
  state = {
    openNotification: false,
    openAccount: false,
    openDomain: false,
    title: 'PROD',
  }

  handleClick = (key) => () => {
    this.setState((preState) => ({ [`open${key}`]: !preState[`open${key}`] }))
  }

  handleClose = (key, cb) => () => {
    this.setState({ [`open${key}`]: false })
    if (cb) cb()
  }

  onLogoutClick = (event) => {
    this.setState({
      openAccount: false,
    })

    navigateDirtyCheck({
      onProceed: () =>
        this.props.dispatch({
          type: 'login/logout',
        }),
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

  updateAPIType (type) {
    updateAPIType(type)
  }

  render () {
    const { classes, rtlActive, user, clinicInfo, header } = this.props
    const { openNotification, openAccount, openDomain, title } = this.state
    const { signalRConnected, notifications } = header
    // console.log(openNotification, openAccount)
    const searchButton = `${classes.top} ${classes.searchButton} ${classNames({
      [classes.searchRTL]: rtlActive,
    })}`
    const dropdownItem = classNames(
      classes.dropdownItem,
      classes.primaryHover,
      { [classes.dropdownItemRTL]: rtlActive },
    )
    const wrapper = classNames({
      [classes.wrapperRTL]: rtlActive,
    })
    const managerClasses = classNames({
      [classes.managerClasses]: true,
    })
    const name =
      user.data && user.data.clinicianProfile
        ? user.data.clinicianProfile.name
        : ''
    const userTitle =
      user.data && user.data.clinicianProfile
        ? user.data.clinicianProfile.title
        : ''

    const clinicShortCode = clinicInfo ? clinicInfo.clinicShortCode : ''

    return (
      <div className={wrapper}>
        <div className={managerClasses}>
          <SizeContainer size='lg'>
            <div>
              {/*  <Badge
                badgeContent={notifications.length}
                color='primary'
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <Button justIcon color='transparent'>
                  <Notifications fontSize='large' />
                </Button>
              </Badge> */}
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

              {/* <Button
                justIcon
                color='transparent'
                aria-label='Person'
                aria-haspopup='true'
                aria-owns={openAccount ? 'menu-list' : null}
                onClick={this.handleClick('Account')}
                className={classes.buttonLink}
                buttonRef={(node) => {
                  this.anchorElAccount = node
                }}
              >
                <Person />
                <span className={classes.username}>
                  {userTitle} {name}
                </span>
              </Button> */}

              <Popper
                className={classNames({
                  [classes.pooperResponsive]: true,
                  [classes.pooperNav]: true,
                })}
                overlay={
                  <MenuList role='menu'>
                    <MenuItem
                      onClick={this.openUserProfileForm}
                      className={dropdownItem}
                    >
                      My Account
                    </MenuItem>
                    <MenuItem
                      onClick={this.openChangePasswordForm}
                      className={dropdownItem}
                    >
                      Change Password
                    </MenuItem>
                    <MenuItem
                      onClick={this.onLogoutClick}
                      className={dropdownItem}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                }
              >
                <Button
                  justIcon
                  color='transparent'
                  aria-label='Person'
                  aria-haspopup='true'
                  aria-owns={openAccount ? 'menu-list' : null}
                  className={classes.buttonLink}
                >
                  <Person />
                  <span className={classes.username}>
                    {userTitle} {name}
                  </span>
                </Button>
              </Popper>
              <Divider
                type='vertical'
                style={{ background: '#999', height: '1.2rem' }}
              />
              <div className={classes.clinicShortCode}>
                <span>{clinicShortCode}</span>
              </div>
              {/* <Divider type='vertical' style={{ background: '#999' }} />
            <div className={classes.clinicShortCode}>
              <span>{clinicShortCode}</span>
            </div> */}
            </div>
          </SizeContainer>
          {/* 
          <Button color='transparent' justIcon className={classes.buttonLink}>
            
          </Button> */}
        </div>
      </div>
    )
  }
}

HeaderLinks.propTypes = {
  classes: PropTypes.object.isRequired,
  rtlActive: PropTypes.bool,
}

export default withStyles(headerLinksStyle)(HeaderLinks)
