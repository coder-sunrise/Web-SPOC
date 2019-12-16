import React from 'react'
import { compose } from 'redux'
// umi
import { FormattedMessage } from 'umi/locale'
// formik
import { withFormik } from 'formik'
// material ui
import Search from '@material-ui/icons/Search'
import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
// common components
import moment from 'moment'
import { GridContainer, GridItem, ProgressButton } from '@/components'
// sub components
import FilterByAppointment from './FilterByAppointment'
import FilterByPatient from './FilterByPatient'
import { APPOINTMENT_STATUS } from '@/utils/constants'

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
      pdpaConsent: 1,
    }),

    handleSubmit: (values, { props }) => {
      const {
        patientName,
        pdpaConsent,
        lastSMSSendStatus,
        // lastVisitDate,
        upcomingAppointmentDate,
        appointmentStatus,
        isReminderSent,
        doctor = [],
        appointmentType = [],
      } = values
      const { dispatch, type, setSelectedRows } = props

      let payload = {}
      let dispatchType = ''
      if (type === 'Appointment') {
        dispatchType = 'smsAppointment'

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
            `${APPOINTMENT_STATUS.DRAFT}|${APPOINTMENT_STATUS.RESCHEDULED}|${APPOINTMENT_STATUS.SCHEDULED}`,
          'AppointmentReminders.PatientOutgoingSMSNavigation.OutgoingSMSFKNavigation.StatusFK': lastSMSSendStatus,
          isReminderSent,
          [doctorProperty]: stringDoctors === 0 ? undefined : stringDoctors,
          [apptTypeProperty]: stringAppType === 0 ? undefined : stringAppType,
        }
      } else {
        dispatchType = 'smsPatient'
        let PDPAConsent
        if (pdpaConsent === 2) {
          PDPAConsent = true
        } else if (pdpaConsent === 3) {
          PDPAConsent = false
        }
        payload = {
          group: [
            {
              name: patientName,
              patientAccountNo: patientName,
              patientReferenceNo: patientName,
              'ContactFkNavigation.contactNumber.number': patientName,
              combineCondition: 'or',
            },
          ],
          'PatientOutgoingSMS.OutgoingSMSFKNavigation.StatusFK': lastSMSSendStatus,
          // 'lgteql_Visit.VisitDate': lastVisitDate
          //   ? moment(lastVisitDate[0]).formatUTC()
          //   : undefined,
          // 'lsteql_Visit.VisitDate': lastVisitDate
          //   ? moment(lastVisitDate[1]).formatUTC(false)
          //   : undefined,
          apiCriteria: {
            PDPAConsent,
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
      }).then((r) => {
        if (r) setSelectedRows([])
      })
    },
  }),
  React.memo,
)(FilterBar)
