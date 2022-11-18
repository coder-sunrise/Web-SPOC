import React, { useMemo, usese } from 'react'
// ant design
import { Menu } from 'antd'
import { useSelector } from 'dva'
// material ui core
import withStyles from '@material-ui/core/styles/withStyles'
import { primaryColor } from 'mui-pro-jss'

// variables
import Authorized from '@/utils/Authorized'
import { VISIT_TYPE } from '@/utils/constants'
import {
  StatusIndicator,
  ContextMenuOptions,
  AppointmentContextMenu,
  filterMap,
  VISIT_STATUS,
} from '../variables'
import { CLINICAL_ROLE } from '@/utils/constants'

const styles = theme => ({
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
      '& svg': {
        fontSize: '0.8rem',
        color: primaryColor,
        position: 'relative',
        top: '5px',
      },
    },
    '& > .ant-menu-item-disabled': {
      '& span': {
        color: 'rgba(0, 0, 0, 0.25) !important',
      },
      '& svg': {
        color: 'rgba(0, 0, 0, 0.25) !important',
        position: 'relative',
        top: '5px',
      },
    },
  },
  icon: {
    color: primaryColor,
    marginRight: theme.spacing(1),
  },
})

const { Secured } = Authorized

const ContextMenu = ({
  row,
  classes,
  rights,
  onMenuItemClick,
  onMenuClick,
  clinicSettings,
}) => {
  const isStatusWaiting = row.visitStatus === VISIT_STATUS.WAITING
  const isVisitEditable = true
  const isStatusInProgress = filterMap[StatusIndicator.DISPENSE].includes(
    row.visitStatus,
  )
  // const isStatusDispense = row.visitStatus === VISIT_STATUS.DISPENSE
  const isRetailVisit = row.visitPurposeFK === VISIT_TYPE.OTC
  const isBillFirstVisit = row.visitPurposeFK === VISIT_TYPE.BF

  const isStatusCompleted = [
    VISIT_STATUS.COMPLETED,
    VISIT_STATUS.IN_CONS,
    VISIT_STATUS.UNGRADED,
    VISIT_STATUS.VERIFIED,
  ].includes(row.visitStatus)

  const user = useSelector(st => st.user)
  const clinicRoleFK = user.data.clinicianProfile.userProfile.role?.clinicRoleFK
  const hideResumeButton =
    clinicRoleFK === 1
      ? ![VISIT_STATUS.IN_CONS, VISIT_STATUS.PAUSED].includes(row.visitStatus)
      : true

  const enableDispense = () => {
    const consDispense = [
      VISIT_STATUS.DISPENSE,
      VISIT_STATUS.ORDER_UPDATED,
      VISIT_STATUS.PAUSED,
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

  const enableBilling = [VISIT_STATUS.BILLING, VISIT_STATUS.COMPLETED].includes(
    row.visitStatus,
  )

  const hideEditConsultation =
    !isStatusCompleted ||
    isRetailVisit ||
    (isBillFirstVisit && !row.hasSignedCOR)

  const contextMenuOptions = useMemo(() => {
    if (row.visitStatus === VISIT_STATUS.UPCOMING_APPT) {
      return AppointmentContextMenu.map(opt => {
        switch (opt.id) {
          case 8: // register visit
            return {
              ...opt,
              disabled: !row.patientProfileFk || !row.patientIsActive,
              hidden: !row.patientProfileFk,
            }
          case 9: // register patient
            return {
              ...opt,
              disabled: !!row.patientProfileFk,
              hidden: !!row.patientProfileFk,
            }
          default:
            return { ...opt }
        }
      })
    }

    const editVisitRights = Authorized.check(
      'queue.visitregistrationdetails',
    ) || {
      rights: 'hidden',
    }

    let disableEditConsultation = false
    if (
      clinicRoleFK === CLINICAL_ROLE.STUDENT &&
      [VISIT_STATUS.UNGRADED, VISIT_STATUS.VERIFIED].includes(row.visitStatus)
    ) {
      disableEditConsultation = true
    }
    return ContextMenuOptions.map(opt => {
      const isDisabled = rights === 'disable'
      switch (opt.id) {
        case 0: // edit visit
          return { ...opt, hidden: editVisitRights.rights !== 'enable' }
        case 0.1: // view visit
          // return { ...opt, hidden: false }
          return { ...opt, hidden: editVisitRights.rights === 'enable' }
        case 1: // dispense
          return {
            ...opt,
            disabled: !row.patientIsActive || row.isFinalized,
          }
        case 1.1: // billing
          return {
            ...opt,
            disabled: !row.patientIsActive || !row.isFinalized || isDisabled,
          }
        case 2: // delete visit
          return { ...opt, disabled: !row.patientIsActive || !isStatusWaiting }
        case 5: // start consultation
          return {
            ...opt,
            disabled: !row.patientIsActive || isStatusInProgress || isDisabled,
            hidden: true,
          }
        case 6: // resume consultation
          return {
            ...opt,
            disabled: !row.patientIsActive || !isStatusInProgress || isDisabled,
            hidden: hideResumeButton || isRetailVisit || isBillFirstVisit,
          }
        case 7: // edit consultation
          return {
            ...opt,
            disabled:
              !row.patientIsActive ||
              !isStatusCompleted ||
              isDisabled ||
              disableEditConsultation,
            hidden: hideEditConsultation,
          }
        case 10: // forms
          return {
            ...opt,
            disabled: !row.patientIsActive,
            hidden: true,
          }
        default:
          return { ...opt }
      }
    })
  })

  const MenuItemsOverlay = (
    <Menu
      onClick={menu => {
        onMenuItemClick(row, menu.key)
        if (onMenuClick) onMenuClick()
      }}
      className={classes.menu}
    >
      {contextMenuOptions.map(
        (
          { disabled, label, Icon, id, isDivider, hidden, authority },
          index,
        ) => {
          if (isDivider) return <Menu.Divider key={`divider-${index}`} />

          const accessRight = Authorized.check(authority)
          if (!accessRight) return null

          const hideByAccessRight = accessRight.rights === 'hidden'
          const disabledByAccessRight =
            accessRight.rights === 'disable' && id !== 4 // skip patient dashboard access right checking

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
