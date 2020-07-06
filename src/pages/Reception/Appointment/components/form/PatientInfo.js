import React from 'react'
import classnames from 'classnames'
import { formatMessage } from 'umi/locale'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import Search from '@material-ui/icons/Search'
// custom component
import {
  Button,
  CodeSelect,
  GridItem,
  TextField,
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
}) => {
  const isRegisteredPatient =
    patientProfileFK !== undefined && patientProfileFK !== null

  const allowedToActualize = [
    APPOINTMENT_STATUS.SCHEDULED,
    APPOINTMENT_STATUS.RESCHEDULED,
  ].includes(appointmentStatusFK)

  return (
    <React.Fragment>
      <GridItem xs md={3}>
        <div className={classnames(classes.buttonGroup)}>
          <FastField
            name='search'
            render={(args) => {
              return (
                <TextField
                  {...args}
                  autoFocus={!isEdit}
                  defaultValue={undefined}
                  label={formatMessage({
                    id: 'reception.queue.patientSearchPlaceholder',
                  })}
                />
              )
            }}
          />
        </div>
      </GridItem>
      <GridItem xs md={5}>
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
                // tabIndex={-1}
                icon={<Search />}
              >
                Search
              </ProgressButton>
              {!isEdit && (
                <Authorized authority='patientdatabase.newpatient'>
                  <Button
                    // tabIndex={-2}
                    size='sm'
                    color='primary'
                    disabled={disabled}
                    onClick={onCreatePatientClick}
                  >
                    Create Patient
                  </Button>
                </Authorized>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
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
              {hasActiveSession && (
                <Authorized authority='queue.registervisit'>
                  <Button
                    size='sm'
                    color='primary'
                    disabled={!isEdit || !allowedToActualize}
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
      <GridItem ms md={4} />
      <GridItem xs md={3}>
        {isEdit ? (
          <TextField value={values.patientName} label='Patient Name' disabled />
        ) : (
          <FastField
            name='patientName'
            render={(args) => {
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
      <GridItem xs md={3}>
        <FastField
          name='countryCodeFK'
          render={(args) => (
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
        <FastField
          name='patientContactNo'
          render={(args) => (
            <MobileNumberInput
              {...args}
              disabled={isRegisteredPatient || disabled || isEdit}
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
