import React, { memo, useMemo } from 'react'
import { useSelector } from 'dva'
// custom components
import { withStyles } from '@material-ui/core'
// components
import { Tooltip } from '@/components'
// medisys component
import { GridContextMenuButton as GridButton } from '@/components/_medisys'
import {
  StatusIndicator,
  AppointmentContextMenu,
  ContextMenuOptions,
  filterMap,
  VISIT_STATUS,
} from '../variables'
import { VISIT_TYPE } from '@/utils/constants'

const ActionButton = ({ row, onClick }) => {
  const { visitStatus } = row

  if (visitStatus === VISIT_STATUS.UPCOMING_APPT) {
    return (
      <Tooltip title='More Options'>
        <div>
          <GridButton
            row={row}
            onClick={onClick}
            contextMenuOptions={AppointmentContextMenu.map(opt => {
              switch (opt.id) {
                case 8: // register visit
                  return {
                    ...opt,
                    disabled: !row.patientProfileFk,
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
            })}
          />
        </div>
      </Tooltip>
    )
  }

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

  const user = useSelector(st => st.user)
  const clinicRoleFK = user.data.clinicianProfile.userProfile.role?.clinicRoleFK
  const hideResumeButton =
    clinicRoleFK === 1
      ? ![VISIT_STATUS.IN_CONS, VISIT_STATUS.PAUSED].includes(row.visitStatus)
      : true

  const isRetailVisit = row.visitPurposeFK === VISIT_TYPE.OTC
  const isBillFirstVisit = row.visitPurposeFK === VISIT_TYPE.BF 

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

  const newContextMenuOptions = useMemo(
    () =>
      ContextMenuOptions.map(opt => {
        switch (opt.id) {
          case 0: // view visit
            return { ...opt, hidden: !isStatusWaiting }
          case 0.1: // edit visit
            return { ...opt, hidden: isStatusWaiting }
          case 1: // dispense
            return {
              ...opt,
              disabled: !enableDispense(),
            }
          case 1.1: // billing
            return { ...opt, disabled: !enableBilling }
          case 2: // delete visit
            return { ...opt, disabled: !isStatusWaiting }
          case 5: // start consultation
            return {
              ...opt,
              disabled: isStatusInProgress,
              hidden: !isStatusWaiting || isRetailVisit || isBillFirstVisit,
            }
          case 6: // resume consultation
            return {
              ...opt,
              disabled: !isStatusInProgress,
              hidden: hideResumeButton || isRetailVisit || isBillFirstVisit,
            }
          case 7: // edit consultation
            return {
              ...opt,
              disabled: !isStatusCompleted,
              hidden: hideEditConsultation,
            }
          case 10: // forms
            return {
              ...opt,
              hidden: isRetailVisit,
            }
          default:
            return { ...opt }
        }
      }),
    [row.rowIndex, row.visitStatus, row.visitPurposeFK, row.hasSignedCOR],
  )
  return (
    <Tooltip title='More Options'>
      <div>
        <GridButton
          row={row}
          onClick={onClick}
          contextMenuOptions={newContextMenuOptions}
        />
      </div>
    </Tooltip>
  )
}

export default ActionButton
