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
import { GridContainer, GridItem, Button } from '@/components'
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
          <Button variant='contained' color='primary' onClick={handleSubmit}>
            <Search />
            <FormattedMessage id='sms.search' />
          </Button>
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
        doctor,
        appointmentType,
      } = values
      console.log({ doctor })
      const { dispatch, type } = props
      const appointmentPayload = {
        lgteql_AppointmentDate: upcomingAppointmentDate
          ? moment(upcomingAppointmentDate[0]).formatUTC()
          : undefined,
        lsteql_AppointmentDate: upcomingAppointmentDate
          ? moment(upcomingAppointmentDate[1]).formatUTC(false)
          : undefined,
        'AppointmentStatusFkNavigation.Code': appointmentStatus,
        'AppointmentReminder.PatientOutgoingSMSNavigation.OutgoingSMSFKNavigation.StatusFkNavigation.code': lastSMSSendStatus,
        isReminderSent,
        'in_AppointmentReminders.AppointmentFKNavigation.Appointment_Resources.ClinicianFkNavigation.DoctorProfileFK': doctor.join(
          '|',
        ),
        'in_AppointmentReminder.AppointmentFKNavigation.AppointmentGroupFK': appointmentType.join(
          '|',
        ),
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
        'PatientOutgoingSMS.OutgoingSMSFKNavigation.StatusFkNavigation.displayValue': lastSMSSendStatus,
        'PatientPdpaConsent.IsConsent': consent,
        'lgteql_Visit.VisitDate': lastVisitDate
          ? moment(lastVisitDate[0]).formatUTC()
          : undefined,
        'lsteql_Visit.VisitDate': lastVisitDate
          ? moment(lastVisitDate[1]).formatUTC(false)
          : undefined,
      }

      let payload = {}
      if (type === 'Appointment') {
        payload = appointmentPayload
      } else {
        payload = patientPayload
      }

      dispatch({
        type: 'sms/query',
        payload: {
          ...payload,
          smsType: type,
        },
      })
    },
  }),
  React.memo,
)(FilterBar)
