import React, { useState, useMemo } from 'react'
// ant design
import { Dropdown, Menu } from 'antd'
// material ui core
import withStyles from '@material-ui/core/styles/withStyles'
import { primaryColor } from 'mui-pro-jss'
// common components
import { SizeContainer } from '@/components'
// variables
import {
  StatusIndicator,
  AppointmentContextMenu,
  ContextMenuOptions,
  filterMap,
  VISIT_STATUS,
} from '../variables'
import Authorized from '@/utils/Authorized'

const styles = (theme) => ({
  leftAlign: {
    justifyContent: 'start',
  },
  menu: {
    '& > .ant-menu-item': {
      margin: 0,
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: '5px 12px',
      lineHeight: '22px',
      height: 'auto',
      '&:hover': {
        background: '#edf2fc',
      },
      '& span': {
        fontSize: '0.8rem',
        color: primaryColor,
      },
    },
    '& > .ant-menu-item-disabled': {
      '& span, & svg': {
        color: 'rgba(0, 0, 0, 0.25) !important',
      },
    },
  },
  icon: {
    color: primaryColor,
    marginRight: theme.spacing(1),
  },
})

const ContextMenu = ({ show, row, handleClick, classes }) => {
  const isStatusWaiting = row.visitStatus === VISIT_STATUS.WAITING
  const isStatusInProgress = filterMap[StatusIndicator.IN_PROGRESS].includes(
    row.visitStatus,
  )
  // const isStatusDispense = row.visitStatus === VISIT_STATUS.DISPENSE

  const isStatusCompleted = [
    VISIT_STATUS.BILLING,
    VISIT_STATUS.COMPLETED,
    VISIT_STATUS.DISPENSE,
    VISIT_STATUS.ORDER_UPDATED,
  ].includes(row.visitStatus)

  const hideResumeButton = ![
    VISIT_STATUS.IN_CONS,
    VISIT_STATUS.PAUSED,
  ].includes(row.visitStatus)

  const enableDispense = [
    VISIT_STATUS.DISPENSE,
    VISIT_STATUS.ORDER_UPDATED,
  ].includes(row.visitStatus)

  const enableBilling = [
    VISIT_STATUS.BILLING,
    VISIT_STATUS.COMPLETED,
  ].includes(row.visitStatus)

  const contextMenuOptions = useMemo(() =>
    ContextMenuOptions.map((opt) => {
      switch (opt.id) {
        case 0: // view visit
          return { ...opt, hidden: !isStatusWaiting }
        case 0.1: // edit visit
          return { ...opt, hidden: isStatusWaiting }
        case 1: // dispense
          return {
            ...opt,
            disabled: !enableDispense,
          }
        case 1.1: // billing
          return { ...opt, disabled: !enableBilling }
        case 2: // delete visit
          return { ...opt, disabled: !isStatusWaiting }
        case 5: // start consultation
          return {
            ...opt,
            disabled: isStatusInProgress,
            hidden: !isStatusWaiting,
          }
        case 6: // resume consultation
          return {
            ...opt,
            disabled: !isStatusInProgress,
            hidden: hideResumeButton,
          }
        case 7: // edit consultation
          return {
            ...opt,
            disabled: !isStatusCompleted,
            hidden: !isStatusCompleted,
          }
        default:
          return { ...opt }
      }
    }),
  )

  const MenuItemsOverlay = (
    <Menu onClick={handleClick} className={classes.menu}>
      {contextMenuOptions.map(
        (
          { disabled, label, Icon, id, isDivider, hidden, authority },
          index,
        ) => {
          if (isDivider) return <Menu.Divider key={`divider-${index}`} />
          const { rights } = Authorized.check(authority)
          const menu = (
            <Menu.Item
              key={id}
              id={id}
              disabled={disabled || rights === 'disable'}
            >
              <Icon className={classes.icon} />
              <span>{label}</span>
            </Menu.Item>
          )
          // eslint-disable-next-line no-nested-ternary
          return hidden || rights === 'hidden' ? null : menu
        },
      )}
    </Menu>
  )

  return MenuItemsOverlay
}

export default withStyles(styles, { name: 'QueueListingContextMenu' })(
  ContextMenu,
)
