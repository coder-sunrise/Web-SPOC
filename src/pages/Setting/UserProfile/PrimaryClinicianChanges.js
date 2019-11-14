import React, { useState } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import { Danger } from '@/components'
import { DoctorProfileSelect } from '@/components/_medisys'

const styles = (theme) => ({
  container: {
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  doctorProfileDropdown: {
    width: '60%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
})

const PrimaryClinicianChanges = ({
  classes,
  primaryRegisteredDoctorFK,
  onConfirmClick,
  footer,
}) => {
  const [
    showError,
    setShowError,
  ] = useState(false)
  const [
    selectedDoctorFK,
    setSelectedDoctorFK,
  ] = useState(primaryRegisteredDoctorFK)

  const handleChange = (value) => {
    if (value === primaryRegisteredDoctorFK) {
      setShowError(true)
    } else {
      setShowError(false)
      setSelectedDoctorFK(value)
    }
  }

  const handleConfirmClick = () => {
    if (selectedDoctorFK === primaryRegisteredDoctorFK) setShowError(true)
    else onConfirmClick(selectedDoctorFK)
  }

  return (
    <React.Fragment>
      <div className={classes.container}>
        <h4>
          This user is a primary clinician. Please select another primary
          clinician for the clinic.
        </h4>
        <div className={classes.doctorProfileDropdown}>
          <DoctorProfileSelect
            label=''
            prefix='Primary Clinician: '
            value={selectedDoctorFK}
            onChange={handleChange}
          />
          {showError && (
            <Danger>
              <p>Cannot select same doctor as primary clinician</p>
            </Danger>
          )}
        </div>
      </div>
      {footer &&
        footer({
          onConfirm: handleConfirmClick,
        })}
    </React.Fragment>
  )
}

export default withStyles(styles)(PrimaryClinicianChanges)
