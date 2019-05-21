import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
// import { Manager, Target, Popper } from "react-popper";

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
import Dashboard from '@material-ui/icons/Dashboard'
import Search from '@material-ui/icons/Search'

// core components
import CustomInput from 'mui-pro-components/CustomInput'
import Button from 'mui-pro-components/CustomButtons'

import headerLinksStyle from 'mui-pro-jss/material-dashboard-pro-react/components/headerLinksStyle'

import { updateAPIType } from '@/utils/request'

class HeaderLinks extends React.Component {
  state = {
    openNotification: false,
    openAccount: false,
    openDomain:false,
    title:'PROD',
  }

  handleClick = (key) => () => {
    this.setState({ [`open${key}`]: !this.state[`open${key}`]})
  }
  
  handleAPIDomainSelection= (key,type) => () => {
    updateAPIType(type)
    this.setState({ [`open${key}`]: !this.state[`open${key}`],title:type})
  }


  handleClose = (key, cb) => () => {
    this.setState({ [`open${key}`]: false })
    if (cb) cb()
  }

  logout = () => {
    sessionStorage.removeItem('token')
    location.href = '/login'
  }

  updateAPIType (type) {
    updateAPIType(type)
  }


  render () {
    const { classes, rtlActive } = this.props
    const { openNotification, openAccount,openDomain,title } = this.state
    
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
    return (
      <div className={wrapper}>
        <CustomInput
          rtlActive={rtlActive}
          formControlProps={{
            fullWidth: false,
            className: `${classes.top} ${classes.search}`,
          }}
          inputProps={{
            placeholder: rtlActive ? 'بحث' : 'Search',
            inputProps: {
              'aria-label': rtlActive ? 'بحث' : 'Search',
              className: classes.searchInput,
            },
          }}
        />
        <Button
          color='white'
          aria-label='edit'
          justIcon
          round
          className={searchButton}
        >
          <Search
            className={`${classes.headerLinksSvg} ${classes.searchIcon}`}
          />
        </Button>
        <Button
          color='transparent'
          simple
          aria-label='Dashboard'
          justIcon
          className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
          muiClasses={{
            label: rtlActive ? classes.labelRTL : '',
          }}
        >
          <Dashboard
            className={`${classes.headerLinksSvg} ${rtlActive
              ? `${classes.links} ${classes.linksRTL}`
              : classes.links}`}
          />
          <Hidden mdUp implementation='css'>
            <span className={classes.linkText}>
              {rtlActive ? 'لوحة القيادة' : 'Dashboard'}
            </span>
          </Hidden>
        </Button>
        <div className={managerClasses}>
          <Button
            color='transparent'
            justIcon
            aria-label='Notifications'
            aria-owns={openNotification ? 'menu-list' : null}
            aria-haspopup='true'
            onClick={this.handleClick('Notification')}
            className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
            muiClasses={{
              label: rtlActive ? classes.labelRTL : '',
            }}
            buttonRef={(node) => {
              this.anchorEl = node
            }}
          >
            <Notifications
              className={`${classes.headerLinksSvg} ${rtlActive
                ? `${classes.links} ${classes.linksRTL}`
                : classes.links}`}
            />
            <span className={classes.notifications}>5</span>
            <Hidden mdUp implementation='css'>
              <span onClick={this.handleClick} className={classes.linkText}>
                {rtlActive ? 'إعلام' : 'Notification'}
              </span>
            </Hidden>
          </Button>
          <Popper
            open={openNotification}
            anchorEl={this.anchorEl}
            transition
            disablePortal
            placement='bottom'
            className={classNames({
              [classes.popperClose]: !openNotification,
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
                  <ClickAwayListener
                    onClickAway={this.handleClose('Notification')}
                  >
                    <MenuList role='menu'>
                      <MenuItem
                        onClick={this.handleClose('Notification')}
                        className={dropdownItem}
                      >
                        {rtlActive ? (
                          'إجلاء أوزار الأسيوي حين بل, كما'
                        ) : (
                          'Mike John responded to your email'
                        )}
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleClose('Notification')}
                        className={dropdownItem}
                      >
                        {rtlActive ? (
                          'شعار إعلان الأرضية قد ذلك'
                        ) : (
                          'You have 5 new tasks'
                        )}
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleClose('Notification')}
                        className={dropdownItem}
                      >
                        {rtlActive ? (
                          'ثمّة الخاصّة و على. مع جيما'
                        ) : (
                          "You're now friend with Andrew"
                        )}
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleClose('Notification')}
                        className={dropdownItem}
                      >
                        {rtlActive ? 'قد علاقة' : 'Another Notification'}
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleClose('Notification')}
                        className={dropdownItem}
                      >
                        {rtlActive ? 'قد فاتّبع' : 'Another One'}
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
        <div className={managerClasses}>
          <Button
            color='transparent'
            aria-label='Person'
            justIcon
            aria-owns={openAccount ? 'menu-list' : null}
            aria-haspopup='true'
            onClick={this.handleClick('Account')}
            className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
            muiClasses={{
              label: rtlActive ? classes.labelRTL : '',
            }}
            buttonRef={(node) => {
              this.anchorElAccount = node
            }}
          >
            <Person
              className={`${classes.headerLinksSvg} ${rtlActive
                ? `${classes.links} ${classes.linksRTL}`
                : classes.links}`}
            />
            <Hidden mdUp implementation='css'>
              <span className={classes.linkText}>
                {rtlActive ? 'الملف الشخصي' : 'Profile'}
              </span>
            </Hidden>
          </Button>
          <Popper
            open={openAccount}
            anchorEl={this.anchorElAccount}
            transition
            disablePortal
            placement='bottom'
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
                        onClick={this.handleClose('Account')}
                        className={dropdownItem}
                      >
                        My Account
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
        <div className={managerClasses}>
          <Button
            color='transparent'
            aria-label='Domain'
            aria-owns={openDomain ? 'menu-list' : null}
            aria-haspopup='true'
            onClick={this.handleClick('Domain')}
            className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
            muiClasses={{
              label: rtlActive ? classes.labelRTL : '',
            }}
            buttonRef={(node) => {
              this.anchorElAccount = node
            }}
          >
            <span className={classes.linkText}>
              {this.state.title}
            </span>

          </Button>
          <Popper
            open={openDomain}
            anchorEl={this.anchorElAccount}
            transition
            disablePortal
            placement='bottom'
            className={classNames({
              [classes.popperClose]: !openDomain,
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
                  <ClickAwayListener onClickAway={this.handleClose('Domain')}>
                    <MenuList role='menu'>
                      <MenuItem
                        onClick={this.handleAPIDomainSelection('Domain','UAT')}
                        className={dropdownItem}
                      >
                        UAT
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleAPIDomainSelection('Domain', 'PROD')}
                        className={dropdownItem}
                      >
                        Production
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
