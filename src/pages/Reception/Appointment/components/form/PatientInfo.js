import React from 'react'
import classnames from 'classnames'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import { Search } from '@material-ui/icons'
// custom component
import {
  Button,
  CodeSelect,
  GridItem,
  TextField,
  NumberInput,
  ProgressButton,
} from '@/components'
import { Mobile } from '@/components/_medisys'
import style from './style'

const PatientInfoInput = ({
  classes,
  onViewPatientProfileClick,
  onSearchPatientClick,
  onCreatePatientClick,
  onRegisterToVisitClick,
  patientProfileFK,
  isEdit,
  disabled,
  appointmentStatusFK,
}) => {
  const isRegisteredPatient =
    patientProfileFK !== undefined && patientProfileFK !== null
  const allowedToActualize = [
    1,
    5,
  ].includes(appointmentStatusFK)

  return (
    <React.Fragment>
      <GridItem xs md={6}>
        <FastField
          name='patientName'
          render={(args) => {
            return (
              <TextField
                {...args}
                // autoFocus
                defaultValue={undefined}
                label='Patient Name / Acc. No.'
                disabled={isEdit}
                loseFocusOnEnterPressed
              />
            )
          }}
        />
      </GridItem>
      <GridItem xs md={6}>
        <div className={classnames(classes.buttonGroup)}>
          {!isRegisteredPatient ? (
            <React.Fragment>
              <ProgressButton
                size='sm'
                color='primary'
                variant='contained'
                submitKey='patientSearch/query'
                disabled={disabled || isEdit}
                onClick={onSearchPatientClick}
                icon={<Search />}
              >
                Search
              </ProgressButton>
              {!isEdit && (
                <Button
                  size='sm'
                  color='primary'
                  disabled={disabled}
                  onClick={onCreatePatientClick}
                >
                  Create Patient
                </Button>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button
                color='primary'
                size='sm'
                // className={classes.patientNameButton}
                onClick={onViewPatientProfileClick}
              >
                Patient Profile
              </Button>
              <Button
                size='sm'
                color='primary'
                disabled={!isEdit || !allowedToActualize}
                onClick={onRegisterToVisitClick}
              >
                Register To Visit
              </Button>
            </React.Fragment>
          )}
        </div>
      </GridItem>
      <GridItem xs md={6}>
        <FastField
          name='patientContactNo'
          render={(args) => (
            <Mobile
              {...args}
              disabled={isRegisteredPatient || disabled || isEdit}
            />
            // <NumberInput
            //   {...args}
            //   disabled={isRegisteredPatient || disabled || isEdit}
            //   label='Contact No.'
            // />
          )}
        />
      </GridItem>
      <GridItem xs md={6}>
        <FastField
          name='appointmentStatusFk'
          render={(args) => (
            <CodeSelect
              {...args}
              disabled
              code='ltappointmentstatus'
              label='Appointment Status'
            />
          )}
        />
      </GridItem>
    </React.Fragment>
  )
}

export default withStyles(style, { name: 'AppointmentForm.PatientInfo' })(
  PatientInfoInput,
)
