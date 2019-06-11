import React from 'react'
import classnames from 'classnames'
import moment from 'moment'
import * as Yup from 'yup'
// umi formatMessage
import { formatMessage } from 'umi/locale'
// formik
import { FastField, Field, withFormik } from 'formik'
// devexpress-react-scheduler
// material ui
import { Divider, CircularProgress, Paper, withStyles } from '@material-ui/core'
// custom component
import {
  Button,
  CommonModal,
  DatePicker,
  GridContainer,
  GridItem,
  SizeContainer,
  NumberInput,
  OutlinedTextField,
  Select,
  AntdInput,
  Primary,
  Checkbox,
  TimePicker,
} from '@/components'
// custom components
import AppointmentTypeSelector from '../Appointment/Calendar/Appointments/AppointmentTypeSelector'
import NewPatient from '../../PatientDatabase/New'
import PatientSearchModal from './PatientSearch'
// services
import {
  fetchPatientListByName,
  fetchPatientInfoByPatientID,
} from './service/appointment'

import { defaultColorOpts, getColorByAppointmentType } from './setting'

const doctors = [
  { value: 'medisys', name: 'Medisys' },
  { value: 'levinne', name: 'Dr Levinne' },
  { value: 'cheah', name: 'Dr Cheah' },
  { value: 'tan', name: 'Dr Tan' },
  { value: 'lim', name: 'Dr Lim' },
  { value: 'liu', name: 'Dr Liu' },
]

const recurrencePattern = [
  { name: 'Daily', value: 'daily' },
  { name: 'Weekly', value: 'weekly' },
  { name: 'Monthly', value: 'wonthly' },
]

const RECURRENCE_RANGE = {
  AFTER: 'after',
  BY: 'by',
}

const _dateFormat = 'DD MMM YYYY'
const _slotInfoDateFormat = 'MMM DD YYYY'

const getDateValue = (v) => {
  if (!v) return v
  if (moment.isMoment(v)) {
    return v.format(_dateFormat)
  }
  return moment(v).isValid() ? moment(v).format(_dateFormat) : v
}

const styles = (theme) => ({
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    zIndex: 99999,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  formContent: {
    padding: `${theme.spacing.unit}px 0`,
  },
  content: {
    margin: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    padding: `0px ${theme.spacing.unit}px`,
  },
  rowContainer: {
    padding: '0px !important',
  },
  colorChipContainer: {
    marginTop: 'auto',
    marginBottom: '10px',
  },
  defaultColor: {
    background: defaultColorOpts.value,
    '&:hover': {
      backgroundColor: defaultColorOpts.activeColor,
    },
  },
  remarksField: {
    marginTop: theme.spacing.unit * 2,
  },
  dateTimePreview: {
    fontSize: '1rem',
    textAlign: 'left',
    paddingLeft: theme.spacing.unit * 9,
    paddingTop: theme.spacing.unit,
  },
  buttonGroup: {
    height: '100%',
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
  },
  actionsBtnGroup: {
    textAlign: 'right',
    paddingRight: theme.spacing.unit,
  },
  apptLabel: {
    textAlign: 'left',
    paddingLeft: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
  },
  apptSubLabel: {
    textAlign: 'right',
    fontSize: '.85rem',
    paddingTop: 12,
  },
  divider: {
    marginTop: 15,
    marginBottom: 10,
  },
})

const DATETIME_KEY = {
  START: 'start',
  END: 'end',
}

const AppointmentSchema = Yup.object().shape({
  patientName: Yup.string().required(),
  contactNo: Yup.string().required(),
  doctor: Yup.string().required(),
  startDate: Yup.string().required(),
  endDate: Yup.string().required(),
})

const initialAptInfo = {
  patientName: '',
  contactNo: '',
  doctor: '',
  bookBy: '',
  bookDate: '',
  remarks: '',
  enableRecurrence: false,
  recurrencePattern: 'daily',
  recurrenceRange: RECURRENCE_RANGE.AFTER,
  occurence: '',
}

@withFormik({
  enableReinitialize: true,
  validationSchema: AppointmentSchema,
  handleSubmit: (values, { props, resetForm }) => {
    const {
      patientName,
      contactNo,
      startDate,
      endDate,
      startTime,
      endTime,
      appointmentType = '',
      doctor,
    } = values
    const { handleAddEvents, handleUpdateEvents, slotInfo, resources } = props
    const _momentStartDate = moment(
      `${startDate} ${startTime}`,
      `${_dateFormat} hh:mm a`,
    )
    const _nativeStartDate = _momentStartDate.toDate()

    const _momentEndDate = moment(
      `${endDate} ${endTime}`,
      `${_dateFormat} hh:mm a`,
    )
    const _nativeEndDate = _momentEndDate.toDate()
    const assignedResource = resources.find(
      (resource) => resource.resourceId === doctor,
    )
    let resourceId = assignedResource ? assignedResource.resourceId : 'other'

    const event = {
      ...slotInfo,
      ...values,
      tooltip: `${patientName}(${contactNo})`,
      start: _nativeStartDate,
      end: _nativeEndDate,
      title: `${patientName}(${contactNo})`,
      color: getColorByAppointmentType(appointmentType),
      resourceId,
    }

    switch (slotInfo.type) {
      case 'update':
        handleUpdateEvents(event)
        break
      default:
        handleAddEvents(event)
        break
    }
    resetForm()
  },
  mapPropsToValues: ({ slotInfo, resources = [] }) => {
    const startDate = moment(slotInfo.start, _slotInfoDateFormat).format(
      _dateFormat,
    )
    const startTime = moment(slotInfo.start, _slotInfoDateFormat).format(
      'hh:mm a',
    )
    const endDate = moment(slotInfo.end, _slotInfoDateFormat).format(
      _dateFormat,
    )
    const endTime = moment(slotInfo.end, _slotInfoDateFormat).format('hh:mm a')

    const currentResource = resources.find(
      (resource) => resource.resourceId === slotInfo.resourceId,
    )
    let doctor = ''
    if (currentResource) {
      doctor =
        currentResource.resourceId !== 'other' ? currentResource.resourceId : ''
    }

    return {
      ...initialAptInfo,
      ...slotInfo,
      doctor,
      startDate,
      startTime,
      endDate,
      endTime,
    }
  },
})
class Form extends React.PureComponent {
  state = {
    showNewPatientModal: false,
    showSearchPatientModal: false,
    patientList: [],
    patientInfo: {},
  }

  toggleNewPatientModal = () => {
    const { showNewPatientModal } = this.state
    this.setState({ showNewPatientModal: !showNewPatientModal })
  }

  openSearchPatientModal = () => {
    // const { dispatch, values } = this.props
    // dispatch({
    //   type: 'appointment/fetchPatientListByName',
    //   payload: values.patientName,
    // })

    this.setState({ showSearchPatientModal: true })
  }

  closeSearchPatientModal = () => {
    this.setState({ showSearchPatientModal: false })
  }

  onSearchPatient = () => {
    const { values } = this.props

    fetchPatientListByName(values.patientName).then((response) => {
      if (response) {
        const { data: { data = [] } } = response
        this.setState({
          patientList: [
            ...data,
          ],
          showSearchPatientModal: true,
        })
      }
    })
  }

  handleSelectPatient = (patientID) => {
    fetchPatientInfoByPatientID(patientID).then((response) => {
      if (response) {
        const patientInfo = { ...response.data }
        const { name, contact } = patientInfo
        const patientName = name !== undefined ? name : ''
        let contactNumber = ''
        if (contact) {
          const { mobileContactNumber } = contact
          contactNumber = mobileContactNumber.number
        }
        const { setFieldValue, setFieldTouched } = this.props

        setFieldValue('patientName', patientName)
        setFieldValue('contactNo', contactNumber)

        setFieldTouched('patientName', true)
        setFieldTouched('contactNo', true)

        this.setState({
          showSearchPatientModal: false,
        })
      }
    })
  }

  render () {
    const {
      classes,
      onConfirm,
      handleCreatePatientClick,
      handleSearchClick,
      isLoading,
      handleSubmit,
      slotInfo,
      values,
    } = this.props

    const {
      showNewPatientModal,
      showSearchPatientModal,
      patientList,
    } = this.state

    console.log('values', { err: this.props.errors, values })

    return (
      <SizeContainer>
        <Paper className={classnames(classes.content)}>
          {isLoading && (
            <div className={classnames(classes.loading)}>
              <CircularProgress />
              <Primary>
                <h3 style={{ fontWeight: 400 }}>Populating patient info...</h3>
              </Primary>
            </div>
          )}

          <GridContainer
            className={classnames(classes.formContent)}
            alignItems='flex-start'
          >
            <GridItem container xs md={12}>
              <GridItem xs md={7}>
                <Field
                  name='patientName'
                  render={(args) => {
                    return (
                      <AntdInput
                        {...args}
                        autoFocus
                        onEnterPressed={this.onSearchPatient}
                        label={formatMessage({
                          id: 'reception.appt.form.patientName',
                        })}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs md={5}>
                <div className={classnames(classes.buttonGroup)}>
                  <Button
                    size='sm'
                    color='primary'
                    onClick={this.onSearchPatient}
                  >
                    Search
                  </Button>
                  <Button
                    size='sm'
                    color='primary'
                    onClick={this.toggleNewPatientModal}
                  >
                    Create Patient
                  </Button>
                </div>
              </GridItem>
              <GridItem xs md={7}>
                <Field
                  name='contactNo'
                  render={(args) => (
                    <AntdInput
                      {...args}
                      label={formatMessage({
                        id: 'reception.appt.form.contactNo',
                      })}
                    />
                  )}
                />
              </GridItem>

              <GridItem xs md={12} className={classnames(classes.remarksField)}>
                <FastField
                  name='remarks'
                  render={(args) => (
                    <OutlinedTextField
                      {...args}
                      multiline
                      rowsMax={6}
                      rows={4}
                      label={formatMessage({
                        id: 'reception.appt.form.remarks',
                      })}
                    />
                  )}
                />
              </GridItem>

              <GridItem xs md={6}>
                <FastField
                  name='doctor'
                  render={(args) => (
                    <Select
                      {...args}
                      options={doctors}
                      label={formatMessage({
                        id: 'reception.appt.form.doctor',
                      })}
                    />
                  )}
                />
              </GridItem>

              <GridItem xs md={6}>
                <FastField
                  name='appointmentType'
                  render={(args) => (
                    <AppointmentTypeSelector
                      {...args}
                      label='Appointment Type'
                    />
                  )}
                />
              </GridItem>
            </GridItem>
            <GridItem xs md={12}>
              <p className={classnames(classes.apptLabel)}>Appointment Time</p>
            </GridItem>
            <GridItem xs md={1}>
              <p className={classnames(classes.apptSubLabel)}>From</p>
            </GridItem>
            <GridItem xs md={3}>
              <Field
                name='startDate'
                // validate={startDateValidation}
                render={(args) => (
                  <DatePicker
                    noLabel
                    {...args}
                    format={_dateFormat}
                    // onChange={onStartDateChange}
                    // label={formatMessage({
                    //   id: 'reception.appt.form.appointmentTime',
                    // })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={2}>
              <Field
                name='startTime'
                // validate={startDateValidation}
                render={(args) => (
                  <TimePicker
                    {...args}
                    noLabel
                    format='hh:mm a'
                    use12Hours
                    minuteStep={15}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={1}>
              <p className={classnames(classes.apptSubLabel)}>To</p>
            </GridItem>
            <GridItem xs md={3}>
              <Field
                name='endDate'
                // validate={startDateValidation}
                render={(args) => (
                  <DatePicker noLabel {...args} format={_dateFormat} />
                )}
              />
            </GridItem>
            <GridItem xs md={2}>
              <Field
                name='endTime'
                // validate={startDateValidation}
                render={(args) => (
                  <TimePicker
                    {...args}
                    noLabel
                    format='hh:mm a'
                    use12Hours
                    minuteStep={15}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={6}>
              {/* invalidEndDate ? (
                <Danger>
                  <p className={classnames(classes.dateTimePreview)}>
                    {values.endDate}
                  </p>
                </Danger>
              ) : (
                <p className={classnames(classes.dateTimePreview)}>
                  {values.endDate}
                </p>
              ) */}
              <p className={classnames(classes.dateTimePreview)}>
                {`${values.startDate} ${values.startTime}, ${moment(
                  values.startDate,
                  _dateFormat,
                ).format('dddd')}`}
              </p>
            </GridItem>
            <GridItem xs md={6}>
              {/* invalidEndDate ? (
                <Danger>
                  <p className={classnames(classes.dateTimePreview)}>
                    {values.endDate}
                  </p>
                </Danger>
              ) : (
                <p className={classnames(classes.dateTimePreview)}>
                  {values.endDate}
                </p>
              ) */}
              <p className={classnames(classes.dateTimePreview)}>
                {`${values.endDate} ${values.endTime}, ${moment(
                  values.endDate,
                  _dateFormat,
                ).format('dddd')}`}
              </p>
            </GridItem>
            <GridItem xs md={12}>
              <Divider className={classnames(classes.divider)} />
              <FastField
                name='enableRecurrence'
                render={(args) => {
                  return <Checkbox simple label='Enable Recurrence' {...args} />
                }}
              />
            </GridItem>
            {values.enableRecurrence && (
              <React.Fragment>
                <GridItem xs md={4}>
                  <FastField
                    name='recurrencePattern'
                    render={(args) => (
                      <Select
                        {...args}
                        options={recurrencePattern}
                        label={formatMessage({
                          id: 'reception.appt.form.recurrencePattern',
                        })}
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs md={4}>
                  <FastField
                    name='recurrenceRange'
                    render={(args) => (
                      <Select
                        {...args}
                        label='Range of Recurrence'
                        options={[
                          {
                            value: RECURRENCE_RANGE.AFTER,
                            name: formatMessage({
                              id: 'reception.appt.form.endAfter',
                            }),
                          },
                          {
                            value: RECURRENCE_RANGE.BY,
                            name: formatMessage({
                              id: 'reception.appt.form.endBy',
                            }),
                          },
                        ]}
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs md={4}>
                  {values.recurrenceRange === RECURRENCE_RANGE.AFTER && (
                    <Field
                      name='occurence'
                      render={(args) => (
                        <NumberInput
                          {...args}
                          label={formatMessage({
                            id: 'reception.appt.form.occurence',
                          })}
                        />
                      )}
                    />
                  )}
                  {values.recurrenceRange === RECURRENCE_RANGE.BY && (
                    <FastField
                      name='stopDate'
                      render={(args) => (
                        <DatePicker
                          {...args}
                          label={formatMessage({
                            id: 'reception.appt.form.stopDate',
                          })}
                        />
                      )}
                    />
                  )}
                </GridItem>
              </React.Fragment>
            )}
          </GridContainer>
        </Paper>
        <div className={classnames(classes.actionsBtnGroup)}>
          <Button onClick={onConfirm} color='danger'>
            Cancel
          </Button>
          <Button color='success'>Save Draft</Button>
          <Button onClick={handleSubmit} color='primary'>
            Confirm
          </Button>
        </div>

        <CommonModal
          open={showNewPatientModal}
          title='Register New Patient'
          onClose={this.toggleNewPatientModal}
          onConfirm={this.toggleNewPatientModal}
          fullScreen
          showFooter={false}
        >
          {showNewPatientModal ? <NewPatient /> : null}
        </CommonModal>
        <CommonModal
          open={showSearchPatientModal}
          title='Search Patient'
          onClose={this.closeSearchPatientModal}
          onConfirm={this.closeSearchPatientModal}
          maxWidth='md'
          showFooter={false}
        >
          {showSearchPatientModal ? (
            <PatientSearchModal
              searchPatientName={values.patientName}
              patientList={patientList}
              onBackClick={this.closeSearchPatientModal}
              onSelectClick={this.handleSelectPatient}
            />
          ) : null}
        </CommonModal>
      </SizeContainer>
    )
  }
}

const FormComponent = withStyles(styles, { name: 'AppointmentFormComponent' })(
  Form,
)

export default FormComponent
