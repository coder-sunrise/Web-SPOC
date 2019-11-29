import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
// custom component
import { Button, GridContainer, GridItem, SizeContainer } from '@/components'
import { APPOINTMENT_STATUS } from '@/utils/constants'
import style from './style'
import Authorized from '@/utils/Authorized'

const ButtonText = {
  DELETE: 'Delete',
  CANCEL_APPOINTMENT: 'Cancel Appointment',
  CANCEL: 'Cancel',
  CHECK: 'Check Availability',
  DRAFT: 'Save Draft',
  ADD: 'Save Appointment',
  EDIT: 'Reschedule Appointment',
}

const FormFooter = ({
  classes,
  disabled = false,
  disabledCheckAvailability = false,
  appointmentStatusFK,
  onClose,
  handleCancelOrDeleteClick,
  handleSaveDraftClick,
  handleConfirmClick,
  handleValidateClick,
}) => {
  const isNew = appointmentStatusFK === undefined
  const isDraft = appointmentStatusFK === 2
  const isTurnedUp = appointmentStatusFK === APPOINTMENT_STATUS.TURNEDUP

  const hideCancelAppointmentClass = {
    [classes.hideCancelAppointmentBtn]: isNew,
  }

  const confirmBtnText = isNew || isDraft ? ButtonText.ADD : ButtonText.EDIT

  return (
    <SizeContainer size='md'>
      <div className={classnames(classes.footer)}>
        <GridContainer>
          <GridItem xs md={12} container justify='flex-end'>
            <Button onClick={onClose} color='danger'>
              {ButtonText.CANCEL}
            </Button>
            <Button
              disabled={disabledCheckAvailability || isTurnedUp}
              color='success'
              onClick={handleValidateClick}
            >
              {ButtonText.CHECK}
            </Button>
            <Authorized authority='appointment.deletecancelappointment'>
              <Button
                color='danger'
                className={classnames(hideCancelAppointmentClass)}
                onClick={handleCancelOrDeleteClick}
                disabled={disabled || isTurnedUp}
              >
                {isDraft ? ButtonText.DELETE : ButtonText.CANCEL_APPOINTMENT}
              </Button>
            </Authorized>

            {(isNew || isDraft) && (
              <Button
                disabled={disabled}
                onClick={handleSaveDraftClick}
                color='info'
              >
                {ButtonText.DRAFT}
              </Button>
            )}
            <Button
              disabled={disabled || isTurnedUp}
              onClick={handleConfirmClick}
              color='primary'
            >
              {confirmBtnText}
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    </SizeContainer>
  )
}

export default withStyles(style, { name: 'AppointmentFormFooter' })(FormFooter)
