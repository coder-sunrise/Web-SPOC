import React from 'react'
import classnames from 'classnames'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// custom component
import {
  Button,
  CodeSelect,
  GridItem,
  TextField,
  ProgressButton,
} from '@/components'
import style from './style'

const PatientInfoInput = ({
  classes,
  onSearchPatientClick,
  onCreatePatientClick,
  onRegisterToVisitClick,
  patientName,
  patientProfileFK,
  isEdit,
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
        {!isRegisteredPatient ? (
          <FastField
            name='patientName'
            render={(args) => {
              return (
                <TextField
                  {...args}
                  autoFocus
                  // onEnterPressed={onSearchPatient}
                  label='Patient Name / Acc. No.'
                  disabled={isEdit}
                />
              )
            }}
          />
        ) : (
          <div className={classnames(classes.buttonGroup)}>
            <Button color='primary' link className={classes.patientNameButton}>
              {patientName}
            </Button>
          </div>
        )}
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
                disabled={isEdit}
                onClick={onSearchPatientClick}
                icon={null}
              >
                Search
              </ProgressButton>
              <Button
                size='sm'
                color='primary'
                // disabled={isEdit}
                onClick={onCreatePatientClick}
              >
                Create Patient
              </Button>
            </React.Fragment>
          ) : (
            <Button
              size='sm'
              color='primary'
              disabled={!isEdit || !allowedToActualize}
              onClick={onRegisterToVisitClick}
            >
              Register To Visit
            </Button>
          )}
        </div>
      </GridItem>
      <GridItem xs md={6}>
        <FastField
          name='patientContactNo'
          render={(args) => (
            <TextField
              {...args}
              disabled={isEdit && appointmentStatusFK !== 2}
              label='Contact No.'
            />
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
