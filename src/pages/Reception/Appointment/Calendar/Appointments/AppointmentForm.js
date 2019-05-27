import React, { PureComponent } from 'react'
import classnames from 'classnames'
import moment from 'moment'
// yup
import * as Yup from 'yup'
// formik
import { withFormik } from 'formik'
// umi
import { FormattedMessage } from 'umi/locale'
// devexpress-react-scheduler
import { AppointmentForm } from '@devexpress/dx-react-scheduler-material-ui'
// material ui
import { Paper, withStyles } from '@material-ui/core'
import { Close } from '@material-ui/icons'
// custom component
import { Button, GridItem } from '@/components'
import Form from './Form'
import { getDateValue } from '../../utils'

const styles = (theme) => ({
  container: {
    width: '55%',
    minWidth: '50%',
    padding: 0,
    paddingBottom: theme.spacing.unit * 2,
  },
  warningContainer: {
    margin: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    padding: `0px ${theme.spacing.unit}px`,
    backgroundColor: '#d32f2f',
    textAlign: 'center',
  },
  warning: {
    // color: '#f44336',
    color: 'white',
    padding: '15px 0px',
    fontWeight: 500,
    fontSize: '1.25rem',
  },
  header: {
    overflow: 'hidden',
    paddingTop: theme.spacing.unit / 2,
    textAlign: 'center',
  },
  title: {
    display: 'inline-block',
  },
  closeButton: {
    float: 'right',
  },
  actionButtons: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
  },
  cancelAppointmentBtn: {
    textAlign: 'left',
    display: 'inline-block',
    width: '20%',
  },
  otherBtn: { textAlign: 'right', display: 'inline-block', width: '80%' },
  btnNoMargin: {
    marginRight: '0px !important',
  },
  blink: {
    animation: 'blink-animation 1s alternate infinite',
    '-webkit-animation': 'blink-animation 1s alternate infinite',
  },
  '@keyframes blink-animation': {
    '0%': {
      backgroundColor: '#e57373',
    },
    '50%': {
      backgroundColor: '#f44336',
    },
    '100%': {
      backgroundColor: '#e53935',
    },
  },
  // '@-webkit-keyframes blink-animation': {
  //   '0%': {
  //     backgroundColor: '#e57373',
  //   },
  //   '50%': {
  //     backgroundColor: '#f44336',
  //   },
  //   '100%': {
  //     backgroundColor: '#e53935',
  //   },
  // },
})

const RECURRENCE_RANGE = {
  AFTER: 'after',
  BY: 'by',
}
const initialAptInfo = {
  allDay: false,
  patientName: '',
  contactNo: '',
  doctor: '',
  bookBy: '',
  bookDate: '',
  colorTag: 'default',
  remarks: '',
  recurrencePattern: 'none',
  recurrenceRange: RECURRENCE_RANGE.AFTER,
  occurence: '',
}

const AppointmentSchema = Yup.object().shape({
  patientName: Yup.string().required(),
  contactNo: Yup.string().required(),
  doctor: Yup.string().required(),
  startDate: Yup.string().required(),
  endDate: Yup.string().required(),
})

const _dateTimeFormat = 'DD MMM YYYY HH:mm'

@withFormik({
  enableReinitialize: true,
  validationSchema: AppointmentSchema,
  handleSubmit: (values, { props, resetForm }) => {
    const { visibleChange, commitChanges, appointmentData } = props

    const isNewAppointment = appointmentData.id === undefined

    const title = `${values.patientName}(PT-000001A), ${values.contactNo}`
    const type = isNewAppointment ? 'added' : 'changed'

    const data = !isNewAppointment
      ? { ...values, allDay: false, title, id: appointmentData.id }
      : { ...values, allDay: false, title }

    commitChanges({ [type]: data })
    resetForm()
    visibleChange()
  },
  mapPropsToValues: (props) => {
    const { appointmentData } = props

    const startDateValue = getDateValue(appointmentData.startDate)
    const endDateValue = getDateValue(appointmentData.endDate)

    const startTime = moment(appointmentData.startDate)
      .format('HH:mm')
      .toString()
    const endTime = moment(appointmentData.endDate).format('HH:mm').toString()

    return {
      ...initialAptInfo,
      ...appointmentData,

      startDate: moment(`${startDateValue} ${startTime}`).format(
        _dateTimeFormat,
      ),
      startTime,
      endDate: moment(`${endDateValue} ${endTime}`).format(_dateTimeFormat),
      endTime,
    }
  },
})
class AppointmentFormContainerBasic extends PureComponent {
  onDateChange = (name, value) => {
    const { setFieldValue, values } = this.props
    const dateKey = `${name}Date`
    const timeKey = `${name}Time`
    if (value === '') {
      setFieldValue(dateKey, value)
      return
    }

    // const startTime = moment(values[key], _dateTimeFormat)
    //   .format('HH:mm')
    //   .toString()
    const time = values[timeKey] !== '' ? values[timeKey] : '00:00'

    // const newDate = moment(value, 'DD MM YYYY').format('DD MMM YYYY')
    let result = moment(`${value} ${time}`, _dateTimeFormat).format(
      'DD MMM YYYY HH:mm',
    )

    setFieldValue(dateKey, result)
  }

  onTimeChange = (name, value) => {
    const { setFieldValue, values } = this.props
    const dateKey = `${name}Date`
    const timeKey = `${name}Time`
    const dateValue = getDateValue(values[dateKey])

    const newDateTime = moment(`${dateValue} ${value}`, _dateTimeFormat).format(
      _dateTimeFormat,
    )

    setFieldValue(timeKey, value)
    moment(newDateTime).isValid() && setFieldValue(dateKey, newDateTime)
  }

  determineConflict = () => {}

  render () {
    const {
      classes,
      visible,
      visibleChange,
      appointmentData,
      submitForm,
      values,
    } = this.props
    const isNewAppointment = appointmentData.id === undefined
    const isConflict = false

    return (
      <AppointmentForm.Popup visible={visible}>
        <AppointmentForm.Container className={classes.container}>
          <div className={classes.header}>
            <h4 className={classes.title}>Add appointment</h4>
            <Button
              className={classes.closeButton}
              simple
              justIcon
              onClick={visibleChange}
            >
              <Close color='danger' />
            </Button>
          </div>

          <Form
            values={values}
            appointmentData={appointmentData}
            onDateChange={this.onDateChange}
            onTimeChange={this.onTimeChange}
          />

          {isConflict && (
            <Paper
              className={classnames([
                classes.warningContainer,
                classes.blink,
              ])}
            >
              <div className={classnames(classes.warning)}>
                <FormattedMessage id='reception.appt.conflictWarning' />
              </div>
            </Paper>
          )}
          <div className={classnames(classes.actionButtons)}>
            <div className={classnames(classes.cancelAppointmentBtn)}>
              <Button color='danger'>
                <FormattedMessage id='reception.appt.form.cancelAppointment' />
              </Button>
            </div>
            <div className={classnames(classes.otherBtn)}>
              <Button color='danger' onClick={visibleChange}>
                <FormattedMessage id='reception.common.cancel' />
              </Button>
              <Button color='info' onClick={visibleChange}>
                <FormattedMessage id='reception.appt.form.validate' />
              </Button>
              <Button
                color='primary'
                onClick={submitForm}
                className={classnames(classes.btnNoMargin)}
              >
                {isNewAppointment ? (
                  <FormattedMessage id='reception.common.add' />
                ) : (
                  <FormattedMessage id='reception.common.save' />
                )}
              </Button>
            </div>
          </div>
        </AppointmentForm.Container>
      </AppointmentForm.Popup>
    )
  }
}

const AppointmentFormContainer = withStyles(styles, {
  name: 'AppointmentFormContainer',
})(AppointmentFormContainerBasic)

export default AppointmentFormContainer
