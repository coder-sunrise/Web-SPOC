import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
// custom component
import { Button, GridContainer, GridItem } from '@/components'

import style from './style'

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
  appointmentStatusFK,
  onClose,
  handleCancelOrDeleteClick,
  handleSaveDraftClick,
  handleConfirmClick,
  handleValidateClick,
}) => {
  const isNew = appointmentStatusFK === undefined
  const isDraft = appointmentStatusFK === 2

  const hideCancelAppointmentClass = {
    [classes.hideCancelAppointmentBtn]: isNew,
  }

  const confirmBtnText = isNew || isDraft ? ButtonText.ADD : ButtonText.EDIT

  return (
    <div className={classnames(classes.footer)}>
      <GridContainer>
        <GridItem xs md={4} container justify='flex-start'>
          <Button
            color='danger'
            className={classnames(hideCancelAppointmentClass)}
            onClick={handleCancelOrDeleteClick}
            disabled={disabled}
          >
            {isDraft ? ButtonText.DELETE : ButtonText.CANCEL_APPOINTMENT}
          </Button>
        </GridItem>

        <GridItem xs md={8} container justify='flex-end'>
          <Button
            disabled={disabled}
            color='success'
            onClick={handleValidateClick}
          >
            {ButtonText.CHECK}
          </Button>
          <Button onClick={onClose} color='danger'>
            {ButtonText.CANCEL}
          </Button>
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
            disabled={disabled}
            onClick={handleConfirmClick}
            color='primary'
          >
            {confirmBtnText}
          </Button>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default withStyles(style, { name: 'AppointmentFormFooter' })(FormFooter)
