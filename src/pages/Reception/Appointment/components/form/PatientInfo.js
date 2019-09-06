import React from 'react'
import classnames from 'classnames'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// custom component
import { Button, GridItem, TextField, ProgressButton } from '@/components'
import style from './style'

const PatientInfoInput = ({
  classes,
  onSearchPatient,
  onCreatePatient,
  patientName,
  patientProfileFK,
  isEdit,
  appointmentStatusFK,
}) => {
  const isRegisteredPatient =
    patientProfileFK !== undefined && patientProfileFK !== null

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
                  label='Patient Name'
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
                onClick={onSearchPatient}
                icon={null}
              >
                Search
              </ProgressButton>
              <Button
                size='sm'
                color='primary'
                disabled={isEdit}
                onClick={onCreatePatient}
              >
                Create Patient
              </Button>
            </React.Fragment>
          ) : (
            <Button size='sm' color='primary' disabled={isEdit}>
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
    </React.Fragment>
  )
}

export default withStyles(style, { name: 'AppointmentForm.PatientInfo' })(
  PatientInfoInput,
)
