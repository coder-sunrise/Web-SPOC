import React from 'react'
import classnames from 'classnames'
import { formatMessage } from 'umi'
// formik
import { FastField, Field } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import Search from '@material-ui/icons/Search'
import PersonAdd from '@material-ui/icons/PersonAdd'
// custom component
import {
  Button,
  CodeSelect,
  GridItem,
  TextField,
  DatePicker,
  ProgressButton,
} from '@/components'
import { MobileNumberInput } from '@/components/_medisys'
import { APPOINTMENT_STATUS } from '@/utils/constants'
import Authorized from '@/utils/Authorized'
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
  values,
  hasActiveSession,
  patientIsActive,
  containsPrimaryClinician,
}) => {
  const isRegisteredPatient =
    patientProfileFK !== undefined && patientProfileFK !== null

  const allowedToActualize = [
    APPOINTMENT_STATUS.CONFIRMED,
    APPOINTMENT_STATUS.RESCHEDULED,
    APPOINTMENT_STATUS.PFA_RESCHEDULED,
  ].includes(appointmentStatusFK)

  return (
    <React.Fragment>
      <GridItem xs md={4}>
        <div className={classnames(classes.buttonGroup)}>
          <FastField
            name='search'
            render={args => {
              return (
                <TextField
                  {...args}
                  autoFocus={!isEdit}
                  defaultValue={undefined}
                  label={formatMessage({
                    id: 'reception.queue.patientSearchPlaceholder',
                  })}
                  onKeyUp={e => {
                    if ([13].includes(e.which)) {
                      setTimeout(() => {
                        onSearchPatientClick()
                      }, 1)
                    }
                  }}
                />
              )
            }}
          />
        </div>
      </GridItem>
      <GridItem xs md={2}>
        <div className={classnames(classes.buttonGroup)}>
          <FastField
            name='dob'
            render={args => (
              <DatePicker
                {...args}
                label='DOB'
                onChange={async e => {
                  if (!e) return
                  try {
                    const { form, field } = args

                    if (form && field) {
                      await form.setFieldValue(field.name, e)
                      onSearchPatientClick()
                    }
                  } catch (error) {}
                }}
              />
            )}
          />
        </div>
      </GridItem>
      <GridItem xs md={4}>
        <div className={classnames(classes.buttonGroup)}>
          {!isRegisteredPatient ? (
            <React.Fragment>
              <Button
                size='sm'
                color='primary'
                variant='contained'
                submitKey='patientSearch/query'
                disabled={disabled || isEdit}
                onClick={onSearchPatientClick}
                // tabIndex={-1}
              >
                {<Search />}Search
              </Button>
              {!isEdit && (
                <Authorized authority='patientdatabase.newpatient'>
                  <Button
                    // tabIndex={-2}
                    size='sm'
                    color='primary'
                    disabled={disabled}
                    onClick={onCreatePatientClick}
                  >
                    <PersonAdd />
                    New Patient
                  </Button>
                </Authorized>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!isRegisteredPatient && (
                <Authorized authority='patientdatabase.patientprofiledetails'>
                  <Button
                    color='primary'
                    size='sm'
                    // className={classes.patientNameButton}
                    onClick={onViewPatientProfileClick}
                  >
                    Patient Profile
                  </Button>
                </Authorized>
              )}
              {hasActiveSession && (
                <Authorized authority='queue.registervisit'>
                  <Button
                    size='sm'
                    color='primary'
                    disabled={
                      !isEdit || !allowedToActualize || !patientIsActive
                    }
                    onClick={onRegisterToVisitClick}
                  >
                    Register To Visit
                  </Button>
                </Authorized>
              )}
            </React.Fragment>
          )}
        </div>
      </GridItem>
      <GridItem xs md={2} />
      {!isRegisteredPatient && (
        <React.Fragment>
          <GridItem xs md={4}>
            {isEdit ? (
              <TextField
                value={values.patientName}
                label='Patient Name'
                disabled
              />
            ) : (
              <FastField
                name='patientName'
                render={args => {
                  return (
                    <TextField
                      {...args}
                      // autoFocus
                      defaultValue={undefined}
                      label='Patient Name'
                      loseFocusOnEnterPressed
                    />
                  )
                }}
              />
            )}
          </GridItem>
          <GridItem xs md={2}>
            <Field
              name='countryCodeFK'
              render={args => (
                <CodeSelect
                  allowClear={false}
                  label='Country Code'
                  code='ctcountrycode'
                  disabled={isRegisteredPatient || disabled || isEdit}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={3}>
            <Field
              name='patientContactNo'
              render={args => (
                <MobileNumberInput
                  {...args}
                  disabled={isRegisteredPatient || disabled || isEdit}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={3}>
            <FastField
              name='email'
              render={args => {
                return (
                  <TextField {...args} defaultValue={undefined} label='Email' />
                )
              }}
            />
          </GridItem>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default withStyles(style, { name: 'AppointmentForm.PatientInfo' })(
  PatientInfoInput,
)
