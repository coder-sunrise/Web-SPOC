import React from 'react'
import { compose } from 'redux'
// umi
import { FormattedMessage } from 'umi'
// formik
import { withFormik } from 'formik'
import { connect } from 'dva'
// material ui
import Search from '@material-ui/icons/Search'
import Print from '@material-ui/icons/Print'
import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
// common components
import moment from 'moment'
import { GridContainer, GridItem, ProgressButton, Button } from '@/components'
// sub components
import { APPOINTMENT_STATUS, SMS_STATUS } from '@/utils/constants'
import { formatDatesToUTC } from '@/utils/dateUtils'
import Authorized from '@/utils/Authorized'
import FilterByAppointment from './FilterByAppointment'
import FilterByPatient from './FilterByPatient'
import PostCardLabelBtn from './PostCardLabelBtn'

const styles = theme => ({
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
  selectedRows,
  smsPatient,
}) => {
  const props = {
    values,
    type,
    dispatch,
    setFieldValue,
    selectedRows,
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
          {type !== 'Appointment' && (
            <PostCardLabelBtn {...props} smsPatient={smsPatient} />
          )}
        </div>
      </GridItem>
    </div>
  )
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withFormik({
    mapPropsToValues: ({ currentUser, doctorprofile }) => {
      const viewOtherApptAccessRight = Authorized.check(
        'appointment.viewotherappointment',
      )

      const isActiveDoctor = doctorprofile.find(
        doctor =>
          doctor.clinicianProfile.isActive &&
          doctor.clinicianProfile.id === currentUser,
      )
      let doctor
      if (
        (!viewOtherApptAccessRight ||
          viewOtherApptAccessRight.rights !== 'enable') &&
        isActiveDoctor
      ) {
        doctor = [currentUser]
      }
      return {
        upcomingAppointmentDate: [moment(), moment().add(1, 'months')],
        appointmentType: [],
        doctor,
        pdpaConsent: ['1', '2', '3'],
      }
    },

    handleSubmit: (values, { props }) => {
      const {
        patientName,
        lastSMSSendStatus,
        upcomingAppointmentDate,
        appointmentStatus,
        isExcludeReminderSent,
        doctor = [],
        appointmentType = [],

        // patient
        pdpaConsent = [],
        visitDate,
        nationality,
        noVisitDate,
        dob,
        ageFrom,
        ageTo,
      } = values
      const {
        dispatch,
        type,
        setSelectedRows,
        currentUser,
        doctorprofile,
      } = props

      let payload = {}
      let dispatchType = ''

      let smsStatusPayload = []
      if (lastSMSSendStatus === SMS_STATUS.SENT) {
        smsStatusPayload = [
          SMS_STATUS.SENT,
          SMS_STATUS.DELIVERED,
          SMS_STATUS.SENDING,
        ]
      } else if (lastSMSSendStatus === SMS_STATUS.FAILED) {
        smsStatusPayload = [SMS_STATUS.FAILED, SMS_STATUS.UNDELIVERED]
      }

      if (type === 'Appointment') {
        dispatchType = 'smsAppointment'

        let stringDoctors = Number(doctor)
        let doctorProperty =
          'Appointment_Resources.CalendarResourceFKNavigation.ClinicianProfile.Id'
        if (doctor.length > 1) {
          doctorProperty =
            'in_Appointment_Resources.CalendarResourceFKNavigation.ClinicianProfile.Id'
          stringDoctors = doctor.join('|')
        } else if (doctor.length <= 0) {
          const viewOtherApptAccessRight = Authorized.check(
            'appointment.viewotherappointment',
          )

          const isActiveDoctor = doctorprofile.find(
            clinician =>
              clinician.clinicianProfile.isActive &&
              clinician.clinicianProfile.id === currentUser,
          )

          if (
            (!viewOtherApptAccessRight ||
              viewOtherApptAccessRight.rights !== 'enable') &&
            !isActiveDoctor
          ) {
            doctorProperty =
              'Appointment_Resources.CalendarResourceFKNavigation.ClinicianProfile.Id'
            stringDoctors = -1
          }
        }
        let stringAppType = Number(appointmentType)
        let apptTypeProperty = 'Appointment_Resources.AppointmentTypeFK'
        if (appointmentType.length > 1) {
          apptTypeProperty = 'in_Appointment_Resources.AppointmentTypeFK'
          stringAppType = appointmentType.join('|')
        }
        const apptStatusProperty = appointmentStatus
          ? 'AppointmentStatusFk'
          : 'in_AppointmentStatusFk'

        const previousProperty =
          apptStatusProperty === 'AppointmentStatusFk'
            ? 'in_AppointmentStatusFk'
            : 'AppointmentStatusFk'
        dispatch({
          type: 'smsAppointment/updateState',
          payload: {
            filter: {
              [previousProperty]: undefined,
            },
          },
        })

        payload = {
          lgteql_AppointmentDate: upcomingAppointmentDate
            ? moment(upcomingAppointmentDate[0]).formatUTC()
            : undefined,
          lsteql_AppointmentDate: upcomingAppointmentDate
            ? moment(upcomingAppointmentDate[1]).formatUTC(false)
            : undefined,
          [apptStatusProperty]:
            appointmentStatus ||
            `${APPOINTMENT_STATUS.RESCHEDULED}|${APPOINTMENT_STATUS.PFA_RESCHEDULED}|${APPOINTMENT_STATUS.CONFIRMED}`,
          'in_AppointmentReminders.PatientOutgoingSMSNavigation.OutgoingSMSFKNavigation.StatusFK': smsStatusPayload.join(
            '|',
          ),
          isReminderSent: isExcludeReminderSent ? false : undefined,
          [doctorProperty]: stringDoctors === 0 ? undefined : stringDoctors,
          [apptTypeProperty]: stringAppType === 0 ? undefined : stringAppType,
        }
      } else {
        dispatchType = 'smsPatient'
        const pdpaphone = pdpaConsent.includes('1') // phone
        const pdpamessage = pdpaConsent.includes('2') // sms
        const pdpaemail = pdpaConsent.includes('3') // email
        const formattedVisitDate = formatDatesToUTC(visitDate)
        const formattedNoVisitDate = formatDatesToUTC(noVisitDate)
        const formattedDOB = formatDatesToUTC(dob)
        payload = {
          apiCriteria: {
            searchValue: patientName,
            visitdatefrom: formattedVisitDate[0],
            visitdateto: formattedVisitDate[1],
            nationality,
            novisitdatefrom: formattedNoVisitDate[0],
            novisitdateto: formattedNoVisitDate[1],
            dobfrom: formattedDOB[0],
            dobto: formattedDOB[1],
            agefrom: ageFrom,
            ageto: ageTo,
            smsstatus: smsStatusPayload.join() || undefined,
            pdpaphone,
            pdpamessage,
            pdpaemail,
          },
        }
      }

      dispatch({
        type: `${dispatchType}/query`,
        payload: {
          // keepFilter: false,
          ...payload,
          smsType: type,
        },
      }).then(r => {
        if (r) setSelectedRows([])
      })
    },
  }),
  React.memo,
)(FilterBar)
