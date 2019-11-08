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
import Popper from '@material-ui/core/Popper'

// @material-ui/icons
import Person from '@material-ui/icons/Person'
import Notifications from '@material-ui/icons/Notifications'
import Link from '@material-ui/icons/Link'
import LinkOff from '@material-ui/icons/LinkOff'
import Search from '@material-ui/icons/Search'

// core components
import CustomInput from 'mui-pro-components/CustomInput'
import Button from 'mui-pro-components/CustomButtons'

import headerLinksStyle from 'mui-pro-jss/material-dashboard-pro-react/components/headerLinksStyle'

import { Badge, SizeContainer } from '@/components'
import { updateAPIType } from '@/utils/request'

@connect(({ user, clinicInfo, global }) => ({
  user,
  clinicInfo,
  global,
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

  logout = () => {
    // localStorage.removeItem('token')
    // location.href = '/login'
    this.props.dispatch({
      type: 'login/logout',
    })
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
    const { classes, rtlActive, user, clinicInfo, global } = this.props
    const { openNotification, openAccount, openDomain, title } = this.state
    const { signalRConnected } = global
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
              {/* <Badge
              badgeContent={15}
              color='primary'
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Button justIcon color='transparent'>
                <Notifications fontSize='large' />
              </Button>
            </Badge>
            <Button justIcon color='transparent'>
              {signalRConnected ? (
                <Badge
                  ripple
                  color='info'
                  overlap='circle'
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  variant='dot'
                >
                  <Link />
                </Badge>
              ) : (
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
                  <LinkOff />
                </Badge>
              )}
            </Button> */}

              <Button
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
                  {userTitle} {name} ({clinicShortCode})
                </span>
              </Button>
              {/* <Divider type='vertical' style={{ background: '#999' }} />
            <div className={classes.clinicShortCode}>
              <span>{clinicShortCode}</span>
            </div> */}
            </div>
          </SizeContainer>
          {/* 
          <Button color='transparent' justIcon className={classes.buttonLink}>
            
          </Button> */}
          <Popper
            open={openAccount}
            anchorEl={this.anchorElAccount}
            transition
            disablePortal
            placement='bottom-end'
            className={classNames({
              [classes.popperClose]: !openAccount,
              [classes.pooperResponsive]: true,
              [classes.pooperNav]: true,
            })}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id='menu-list'
                style={{ transformOrigin: '0 0 0' }}
              >
                <Paper className={classes.dropdown}>
                  <ClickAwayListener onClickAway={this.handleClose('Account')}>
                    <MenuList role='menu'>
                      <MenuItem
                        onClick={this.handleClose(
                          'Account',
                          this.openUserProfileForm,
                        )}
                        className={dropdownItem}
                      >
                        My Account
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleClose(
                          'ChangePassword',
                          this.openChangePasswordForm,
                        )}
                        className={dropdownItem}
                      >
                        Change Password
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleClose('Account', this.logout)}
                        className={dropdownItem}
                      >
                        Logout
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
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
