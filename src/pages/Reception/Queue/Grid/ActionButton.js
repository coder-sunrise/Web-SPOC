import React, { memo, useMemo } from 'react'
// custom components
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

const ActionButton = ({ row, onClick }) => {
  const { visitStatus } = row

  if (visitStatus === VISIT_STATUS.UPCOMING_APPT) {
    return (
      <Tooltip title='More Actions'>
        <GridButton
          row={row}
          onClick={onClick}
          contextMenuOptions={AppointmentContextMenu.map((opt) => {
            switch (opt.id) {
              case 8:
                return { ...opt, disabled: row.patientProfileFk === null }
              case 9:
                return { ...opt, disabled: row.patientProfileFk !== null }
              default:
                return { ...opt }
            }
          })}
        />
      </Tooltip>
    )
  }

  const isStatusWaiting = row.visitStatus === VISIT_STATUS.WAITING
  const isStatusInProgress = filterMap[StatusIndicator.IN_PROGRESS].includes(
    row.visitStatus,
  )
  const isStatusDispense = row.visitStatus === VISIT_STATUS.DISPENSE
  const isStatusCompleted = [
    VISIT_STATUS.COMPLETED,
    VISIT_STATUS.DISPENSE,
  ].includes(row.visitStatus)

  const hideResumeButton = ![
    VISIT_STATUS.IN_CONS,
    VISIT_STATUS.PAUSED,
  ].includes(row.visitStatus)

  const enableBilling = [
    VISIT_STATUS.BILLING,
    VISIT_STATUS.ORDER_UPDATED,
  ].includes(row.visitStatus)

  const newContextMenuOptions = useMemo(
    () =>
      ContextMenuOptions.map((opt) => {
        switch (opt.id) {
          case 0: // view visit
            return { ...opt, hidden: !isStatusWaiting }
          case 0.1: // edit visit
            return { ...opt, hidden: isStatusWaiting }
          case 1: // dispense
            return { ...opt, disabled: !isStatusDispense }
          case 1.1: // billing
            return { ...opt, disabled: !enableBilling }
          case 2: // delete visit
            return { ...opt, disabled: !isStatusWaiting }
          case 5: // start consultation
            return {
              ...opt,
              disabled: isStatusInProgress,
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
    [
      row.rowIndex,
      row.visitStatus,
    ],
  )

  return (
    <Tooltip title='More Actions'>
      <GridButton
        row={row}
        onClick={onClick}
        contextMenuOptions={newContextMenuOptions}
      />
    </Tooltip>
  )
}

export default ActionButton
