import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
// custom component
import {
  Button,
  CardContainer,
  GridContainer,
  GridItem,
  Danger,
} from '@/components'

import style from './style'

const ConfirmText = {
  ADD: 'Save Appointment',
  EDIT: 'Reschedule Appointment',
}

const FormFooter = ({
  classes,
  isNew,
  onCancelAppointmentClick,
  onClose,
  onConfirmClick,
}) => {
  const hideCancelAppointmentClass = {
    [classes.hideCancelAppointmentBtn]: isNew,
  }

  const confirmBtnText = isNew ? ConfirmText.ADD : ConfirmText.EDIT

  return (
    <div className={classnames(classes.footer)}>
      <GridContainer>
        <GridItem xs md={4} container justify='flex-start'>
          <Button
            color='danger'
            className={classnames(hideCancelAppointmentClass)}
            onClick={onCancelAppointmentClick}
          >
            Cancel Appointment
          </Button>
        </GridItem>

        <GridItem xs md={8} container justify='flex-end'>
          <Button onClick={onClose} color='danger'>
            Cancel
          </Button>
          <Button color='success' disabled>
            Save Draft
          </Button>
          <Button onClick={onConfirmClick} color='primary'>
            {confirmBtnText}
          </Button>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default withStyles(style, { name: 'AppointmentFormFooter' })(FormFooter)
