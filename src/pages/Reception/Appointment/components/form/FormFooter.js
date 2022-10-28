import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
// custom component
import { Button, GridContainer, GridItem, SizeContainer } from '@/components'
import { APPOINTMENT_STATUS } from '@/utils/constants'
import Authorized from '@/utils/Authorized'
import style from './style'
import Warning from '@material-ui/icons/Error'

const ButtonText = {
  DELETE: 'Delete',
  CANCEL_APPOINTMENT: 'Cancel Appointment',
  CLOSE: 'Close',
  CHECK: 'Check Availability',
  // DRAFT: 'Save Draft',
  ADD: 'Save Appointment',
  EDIT: 'Save',
}

const FormFooter = ({
  classes,
  disabled = false,
  disabledCheckAvailability = false,
  appointmentStatusFK,
  patientIsActive = true,
  onClose,
  handleCancelOrDeleteClick,
  handleSaveDraftClick,
  handleConfirmClick,
  handleValidateClick,
  conflicts = [],
  id,
}) => {
  const isNew = appointmentStatusFK === undefined || !id
  const isTurnedUp =
    appointmentStatusFK === APPOINTMENT_STATUS.TURNEDUP ||
    appointmentStatusFK === APPOINTMENT_STATUS.TURNEDUPLATE
  const isCancelled =
    appointmentStatusFK === APPOINTMENT_STATUS.CANCELLED ||
    appointmentStatusFK === APPOINTMENT_STATUS.PFA_CANCELLED

  const hideCancelAppointmentClass = {
    [classes.hideCancelAppointmentBtn]: isNew,
  }

  const confirmBtnText = isNew ? ButtonText.ADD : ButtonText.EDIT
  const isExistsPreventConflict =
    conflicts.filter(conflict => conflict.isPrevent).length > 0
  return (
    <SizeContainer size='md'>
      <div className={classnames(classes.footer)}>
        <Authorized authority='appointment.deletecancelappointment'>
          <Button
            color='danger'
            className={classnames(hideCancelAppointmentClass)}
            onClick={handleCancelOrDeleteClick}
            disabled={disabled || isTurnedUp || isCancelled || !patientIsActive}
          >
            {ButtonText.CANCEL_APPOINTMENT}
          </Button>
        </Authorized>
        {/* <Button
          disabled={disabledCheckAvailability || isTurnedUp || isCancelled}
          color='success'
          onClick={handleValidateClick}
        >
          {ButtonText.CHECK}
        </Button> */}
        <Authorized authority='appointment.appointmentdetails'>
          <Button
            disabled={
              disabled ||
              isTurnedUp ||
              isCancelled ||
              !patientIsActive ||
              isExistsPreventConflict
            }
            onClick={handleConfirmClick}
            color='primary'
          >
            {confirmBtnText}
          </Button>
        </Authorized>
      </div>
      {conflicts.length > 0 && (
        <div>
          <h4>Appointment Conflicts:</h4>
          {conflicts.map(conflict => (
            <div
              style={{
                margin: '4px 0px',
                position: 'relative',
                paddingLeft: 24,
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0 }}>
                <Warning
                  //color={conflict.isPrevent ? 'orange' : '#4255bd'}
                  style={{
                    color: conflict.isPrevent ? 'orange' : '#4255bd',
                  }}
                />
              </div>
              <div>{conflict.conflictContent}</div>
            </div>
          ))}
        </div>
      )}
    </SizeContainer>
  )
}

export default withStyles(style, { name: 'AppointmentFormFooter' })(FormFooter)
