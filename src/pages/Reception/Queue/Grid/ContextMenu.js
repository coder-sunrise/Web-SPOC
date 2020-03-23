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
import { VISIT_TYPE } from '@/utils/constants'

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
  const isRetailVisit = row.visitPurposeFK === VISIT_TYPE.RETAIL
  const isBillFirstVisit = row.visitPurposeFK === VISIT_TYPE.BILL_FIRST

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

  const enableDispense = () => {
    const consDispense = [
      VISIT_STATUS.DISPENSE,
      VISIT_STATUS.ORDER_UPDATED,
    ].includes(row.visitStatus)

    const retailDispense = [
      VISIT_STATUS.WAITING,
      VISIT_STATUS.DISPENSE,
      VISIT_STATUS.ORDER_UPDATED,
    ].includes(row.visitStatus)

    const billFirstDispense = [
      VISIT_STATUS.WAITING,
      VISIT_STATUS.DISPENSE,
    ].includes(row.visitStatus)

    if (
      (isRetailVisit && retailDispense) ||
      (isBillFirstVisit && billFirstDispense)
    )
      return true

    return consDispense
  }

  const enableBilling = [
    VISIT_STATUS.BILLING,
    VISIT_STATUS.COMPLETED,
  ].includes(row.visitStatus)

  const hideEditConsultation =
    !isStatusCompleted ||
    isRetailVisit ||
    (isBillFirstVisit && !row.hasSignedCOR)

  const contextMenuOptions = useMemo(() =>
    ContextMenuOptions.map((opt) => {
      const moduleAccessRight = Authorized.check('reception/queue')
      const isReadOnly = moduleAccessRight.rights === 'readonly'
      switch (opt.id) {
        case 0: // view visit
          return { ...opt, hidden: !isStatusWaiting }
        case 0.1: // edit visit
          return { ...opt, hidden: isStatusWaiting, disabled: isReadOnly }
        case 1: // dispense
          return {
            ...opt,
            disabled: !enableDispense(),
          }
        case 1.1: // billing
          return {
            ...opt,
            disabled: !enableBilling || isReadOnly,
          }
        case 2: // delete visit
          return { ...opt, disabled: !isStatusWaiting || isReadOnly }
        case 5: // start consultation
          return {
            ...opt,
            disabled: isStatusInProgress || isReadOnly,
            hidden: !isStatusWaiting || isRetailVisit || isBillFirstVisit,
          }
        case 6: // resume consultation
          return {
            ...opt,
            disabled: !isStatusInProgress || isReadOnly,
            hidden: hideResumeButton || isRetailVisit || isBillFirstVisit,
          }
        case 7: // edit consultation
          return {
            ...opt,
            disabled: !isStatusCompleted || isReadOnly,
            hidden: hideEditConsultation,
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

          const accessRight = Authorized.check(authority)
          if (!accessRight) return null

          const hideByAccessRight = accessRight.rights === 'hidden'
          const disabledByAccessRight = accessRight.rights === 'disable'

          const menu = (
            <Menu.Item
              key={id}
              id={id}
              disabled={disabled || disabledByAccessRight}
            >
              <Icon className={classes.icon} />
              <span>{label}</span>
            </Menu.Item>
          )
          // eslint-disable-next-line no-nested-ternary
          return hidden || hideByAccessRight ? null : menu
        },
      )}
    </Menu>
  )

  return MenuItemsOverlay
}

export default withStyles(styles, { name: 'QueueListingContextMenu' })(
  ContextMenu,
)
