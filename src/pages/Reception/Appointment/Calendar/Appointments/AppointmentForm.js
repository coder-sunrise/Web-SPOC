import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { connect } from 'dva'
import moment from 'moment'
// yup
import * as Yup from 'yup'
// formik
import { withFormik } from 'formik'
// umi
import { formatMessage, FormattedMessage } from 'umi/locale'
// devexpress-react-scheduler
import { AppointmentForm } from '@devexpress/dx-react-scheduler-material-ui'
// material ui
import { Paper, withStyles } from '@material-ui/core'
import { Close } from '@material-ui/icons'
// custom component
import { Button, CommonModal } from '@/components'
import NewPatient from '../../../../PatientDatabase/New'
import PatientSearchModal from '../PatientSearch'
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

@connect(({ appointment, loading }) => ({ appointment, loading }))
@withFormik({
  enableReinitialize: true,
  handleSubmit: (values, { props, resetForm }) => {
    const { visibleChange, commitChanges, appointmentData, dispatch } = props

    const isNewAppointment = appointmentData.id === undefined

    const title = `${values.patientName}(PT-000001A), ${values.contactNo}`
    const type = isNewAppointment ? 'added' : 'changed'

    const data = !isNewAppointment
      ? { ...values, allDay: false, title, id: appointmentData.id }
      : { ...values, allDay: false, title }

    // clear current search patient info
    dispatch({
      type: 'appointment/updateSelectedPatientInfo',
      payload: {},
    })
    // clear searching patient list
    dispatch({
      type: 'appointment/updatePatientList',
      payload: [],
    })
    // commit changes to appointment data in calendar
    commitChanges({ [type]: data })
    resetForm()
    visibleChange()
  },
  mapPropsToValues: (props) => {
    const { appointmentData, appointment } = props
    const { currentSearchPatientInfo: { name, contact } } = appointment

    const patientName = name !== undefined ? name : ''
    let contactNumber = ''
    if (contact) {
      const { mobileContactNumber } = contact
      contactNumber = mobileContactNumber.number
    }

    const startDateValue = getDateValue(appointmentData.startDate)
    const endDateValue = getDateValue(appointmentData.endDate)

    const startTime = moment(appointmentData.startDate)
      .format('HH:mm')
      .toString()
    const endTime = moment(appointmentData.endDate).format('HH:mm').toString()

    return {
      ...initialAptInfo,
      patientName,
      contactNo: contactNumber,
      ...appointmentData,
      startDate: moment(`${startDateValue} ${startTime}`).format(
        _dateTimeFormat,
      ),
      startTime,
      endDate: moment(`${endDateValue} ${endTime}`).format(_dateTimeFormat),
      endTime,
    }
  },
  validationSchema: AppointmentSchema,
})
class AppointmentFormContainerBasic extends PureComponent {
  state = {
    showNewPatientModal: false,
    showSearchPatientModal: false,
  }

  onDateChange = (name, value) => {
    const { setFieldValue, values } = this.props
    const dateKey = `${name}Date`
    const timeKey = `${name}Time`
    if (value === '') {
      setFieldValue(dateKey, value)
      return
    }
    const time = values[timeKey] !== '' ? values[timeKey] : '00:00'
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

  toggleNewPatientModal = () => {
    const { showNewPatientModal } = this.state
    this.setState({ showNewPatientModal: !showNewPatientModal })
  }

  openSearchPatientModal = () => {
    const { dispatch, values } = this.props
    dispatch({
      type: 'appointment/fetchPatientListByName',
      payload: values.patientName,
    })
    this.setState({ showSearchPatientModal: true })
  }

  closeSearchPatientModal = () => {
    this.setState({ showSearchPatientModal: false })
  }

  handleSelectPatient = (patientID) => {
    const { dispatch } = this.props

    this.closeSearchPatientModal()
    dispatch({
      type: 'appointment/fetchPatientInfoByPatientID',
      payload: patientID,
    })
  }

  onCancelAppointmentClick = () => {
    const {
      visibleChange,
      commitChanges,
      appointmentData,
      dispatch,
      resetForm,
    } = this.props
    const type = 'deleted'
    // clear current search patient info
    dispatch({
      type: 'appointment/updateSelectedPatientInfo',
      payload: {},
    })
    // clear searching patient list
    dispatch({
      type: 'appointment/updatePatientList',
      payload: [],
    })
    // commit changes to appointment data in calendar
    commitChanges({ [type]: appointmentData.id })
    resetForm()
    visibleChange()
  }

  render () {
    const { showNewPatientModal, showSearchPatientModal } = this.state
    const {
      appointment,
      loading,
      classes,
      visible,
      visibleChange,
      appointmentData,
      submitForm,
      values,
      dispatch,
    } = this.props
    const isNewAppointment = appointmentData.id === undefined
    const isConflict = false // TODO check if appointment conflict with another
    console.log('appointmentform', this.props)
    return (
      <AppointmentForm.Popup visible={visible}>
        <AppointmentForm.Container className={classes.container}>
          <div className={classes.header}>
            <h4 className={classes.title}>Add appointment</h4>
            <Button
              className={classes.closeButton}
              simple
              justIcon
              color='danger'
              onClick={visibleChange}
            >
              <Close color='danger' />
            </Button>
          </div>

          <Form
            values={values}
            isLoading={loading.models.appointment}
            handleCreatePatientClick={this.toggleNewPatientModal}
            handleSearchClick={this.openSearchPatientModal}
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
              {!isNewAppointment && (
                <Button color='danger' onClick={this.onCancelAppointmentClick}>
                  <FormattedMessage id='reception.appt.form.cancelAppointment' />
                </Button>
              )}
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
            <CommonModal
              open={showNewPatientModal}
              title={formatMessage({
                id: 'reception.queue.patientSearch.registerNewPatient',
              })}
              onClose={this.toggleNewPatientModal}
              onConfirm={this.toggleNewPatientModal}
              fullScreen
              showFooter={false}
            >
              {showNewPatientModal && <NewPatient />}
            </CommonModal>
            <CommonModal
              open={showSearchPatientModal}
              title='Search Patient'
              onClose={this.closeSearchPatientModal}
              onConfirm={this.closeSearchPatientModal}
              maxWidth='md'
              showFooter={false}
            >
              {showSearchPatientModal && (
                <PatientSearchModal
                  searchPatientName={values.patientName}
                  patientList={appointment.patientList}
                  onBackClick={this.closeSearchPatientModal}
                  onSelectClick={this.handleSelectPatient}
                  dispatch={dispatch}
                />
              )}
            </CommonModal>
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
