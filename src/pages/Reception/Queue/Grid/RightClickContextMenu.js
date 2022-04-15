import React, { useState, useMemo, useCallback } from 'react'
import { connect } from 'dva'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

// material ui
import { Popover, Paper } from '@material-ui/core'
import { notification } from '@/components'
// medisys component
// sub component
// utils
import {
  VISIT_STATUS,
  ContextMenuOptions,
  AppointmentContextMenu,
} from '@/pages/Reception/Queue/variables'
import Authorized from '@/utils/Authorized'
import ContextMenu from './ContextMenu'

@connect(({ clinicSettings }) => ({
  clinicSettings: clinicSettings.settings || clinicSettings.default,
}))
class RightClickContextMenu extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()

    this.state = {
      anchorEl: undefined,
      rightClickedRow: undefined,
    }
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   if (this.props.loading !== nextProps.loading) return true
  //   if (this.props.selfOnly !== nextProps.selfOnly) return true
  //   if (this.props.filter !== nextProps.filter) return true
  //   if (anchorEl !== nextState.anchorEl) return true
  //   return false
  // }

  handlePopoverOpen = event =>
    this.setState({
      anchorEl: event.target,
    })

  handlePopoverClose = event =>
    this.setState({
      anchorEl: null,
      rightClickedRow: undefined,
    })

  isAssignedDoctor = row => {
    if (!row.doctor) return false
    const {
      doctor: { id },
      visitStatus,
    } = row
    const {
      clinicianProfile: { doctorProfile },
    } = this.props.user.data

    if (!doctorProfile) {
      notification.error({
        message: 'Current user is not authorized to access',
      })
      return false
    }

    if ([VISIT_STATUS.IN_CONS, VISIT_STATUS.PAUSED].indexOf(visitStatus) >= 0) {
      if (id !== doctorProfile.id) {
        notification.error({
          message: `You cannot resume other doctor's consultation.`,
        })
        return false
      }
    }
    return true
  }

  handleContextMenuClick = menuItem => {
    this.props.onOutsidePopoverRightClick()
  }

  canAccess = id => {
    const apptsActionID = ['8', '9', '10', '11', '12']

    const findMatch = item => item.id === parseFloat(id, 10)

    let menuOpt = ContextMenuOptions.find(findMatch)
    if (apptsActionID.includes(id)) {
      menuOpt = AppointmentContextMenu.find(findMatch)
    }

    const accessRight = Authorized.check(menuOpt.authority)

    // skip for patient dashboard button
    // user can access patient dashboard regardless of access right
    // patient dashboard page will have the access right checking explicitly
    if (id === '4') return true

    return (
      accessRight &&
      (accessRight.rights === 'enable' || accessRight.rights === 'readwrite')
    )
  }

  handleClickAway = () => {
    this.props.dispatch({})
  }

  render() {
    const { anchorEl, rightClickedRow, ...restProps } = this.props
    if (!anchorEl) return null

    return (
      <div>
        <ClickAwayListener onClickAway={this.props.onOutsidePopoverRightClick}>
          <div
            style={{
              zIndex: 1000,
              position: 'fixed',
              left:
                document.documentElement.clientWidth < anchorEl.x + 100
                  ? anchorEl.x - 160
                  : anchorEl.x,
              top:
                document.documentElement.clientHeight < anchorEl.y + 350
                  ? anchorEl.y - 350
                  : anchorEl.y,
            }}
          >
            <Paper>
              <ContextMenu
                show
                onMenuClick={this.handleContextMenuClick}
                row={rightClickedRow}
                clinicSettings
                {...restProps}
              />
            </Paper>
          </div>
        </ClickAwayListener>
      </div>
    )
  }
}

export default RightClickContextMenu
