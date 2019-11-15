import React from 'react'
import { compose } from 'redux'
// umi
import { FormattedMessage } from 'umi/locale'
// formik
import { withFormik } from 'formik'
// material ui
import { Search } from '@material-ui/icons'
import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
// common components
import moment from 'moment'
import { GridContainer, GridItem, ProgressButton } from '@/components'
// sub components
import FilterByAppointment from './FilterByAppointment'
import FilterByPatient from './FilterByPatient'

const styles = (theme) => ({
  filterBar: {
    marginBottom: '20px',
  },
  filterBtn: {
    // paddingTop: '13px',
    lineHeight: standardRowHeight,
    textAlign: 'left',
    '& > button': {
      marginRight: theme.spacing.unit,
    },
  },
})

const FilterBar = ({
  classes,
  type,
  values,
  dispatch,
  handleSubmit,
  setFieldValue,
}) => {
  const props = {
    values,
    type,
    dispatch,
    setFieldValue,
  }

  return (
    <div className={classes.filterBar}>
      <GridContainer>
        {type === 'Appointment' ? (
          <FilterByAppointment {...props} />
        ) : (
          <FilterByPatient {...props} />
        )}
      </GridContainer>
      <GridItem xs={12}>
        <div className={classes.filterBtn}>
          <ProgressButton
            icon={<Search />}
            variant='contained'
            color='primary'
            onClick={handleSubmit}
          >
            <FormattedMessage id='sms.search' />
          </ProgressButton>
        </div>
      </GridItem>
    </div>
  )
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withFormik({
    mapPropsToValues: () => ({
      upcomingAppointmentDate: [
        moment(),
        moment().add(1, 'months'),
      ],
      appointmentType: [],

      lastVisitDate: [
        moment().subtract(1, 'months'),
        moment(),
      ],
      consent: true,
    }),

    handleSubmit: (values, { props }) => {
      const {
        patientName,
        consent,
        lastSMSSendStatus,
        lastVisitDate,
        upcomingAppointmentDate,
        appointmentStatus,
        isReminderSent,
        doctor = [],
        appointmentType = [],
      } = values
      const { dispatch, type } = props
      let stringDoctors = Number(doctor)
      let doctorProperty = 'Appointment_Resources.ClinicianFK'
      if (doctor.length > 1) {
        doctorProperty = 'in_Appointment_Resources.ClinicianFK'
        stringDoctors = doctor.join('|')
      }
      let stringAppType = Number(appointmentType)
      let apptTypeProperty = 'Appointment_Resources.AppointmentTypeFK'
      if (appointmentType.length > 1) {
        apptTypeProperty = 'in_Appointment_Resources.AppointmentTypeFK'
        stringAppType = appointmentType.join('|')
      }
      const appointmentPayload = {
        lgteql_AppointmentDate: upcomingAppointmentDate
          ? moment(upcomingAppointmentDate[0]).formatUTC()
          : undefined,
        lsteql_AppointmentDate: upcomingAppointmentDate
          ? moment(upcomingAppointmentDate[1]).formatUTC(false)
          : undefined,
        AppointmentStatusFk: appointmentStatus,
        'AppointmentReminders.PatientOutgoingSMSNavigation.OutgoingSMSFKNavigation.StatusFK': lastSMSSendStatus,
        isReminderSent,
        [doctorProperty]: stringDoctors === 0 ? undefined : stringDoctors,
        [apptTypeProperty]: stringAppType === 0 ? undefined : stringAppType,
      }
      const patientPayload = {
        group: [
          {
            name: patientName,
            patientAccountNo: patientName,
            'ContactFkNavigation.contactNumber.number': patientName,
            combineCondition: 'or',
          },
        ],
        'PatientOutgoingSMS.OutgoingSMSFKNavigation.StatusFK': lastSMSSendStatus,
        'PatientPdpaConsent.IsConsent': consent,
        'lgteql_Visit.VisitDate': lastVisitDate
          ? moment(lastVisitDate[0]).formatUTC()
          : undefined,
        'lsteql_Visit.VisitDate': lastVisitDate
          ? moment(lastVisitDate[1]).formatUTC(false)
          : undefined,
      }

      let payload = {}
      let dispatchType = ''
      if (type === 'Appointment') {
        dispatchType = 'smsAppointment'
        payload = appointmentPayload
      } else {
        dispatchType = 'smsPatient'
        payload = patientPayload
      }

      dispatch({
        type: `${dispatchType}/query`,
        payload: {
          ...payload,
          smsType: type,
        },
      })
    },
  }),
  React.memo,
)(FilterBar)
