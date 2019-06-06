import React from 'react'
import classnames from 'classnames'
import moment from 'moment'
// umi formatMessage
import { formatMessage } from 'umi/locale'
// formik
import { FastField, Field, withFormik } from 'formik'
// devexpress-react-scheduler
// material ui
import { CircularProgress, Paper, withStyles } from '@material-ui/core'
// custom component
import {
  Button,
  DatePicker,
  GridContainer,
  GridItem,
  NumberInput,
  OutlinedTextField,
  Select,
  AntdInput,
  RadioGroup,
  Primary,
  Danger,
  DateRangePicker,
  TimePicker,
} from '@/components'
// custom components
import AppointmentTypeSelector from '../../Reception/Appointment/Calendar/Appointments/AppointmentTypeSelector'
import { defaultColorOpts, getColorByAppointmentType } from './setting'

const doctors = [
  { value: 'bao', name: 'Bao' },
  { value: 'cheah', name: 'Cheah' },
  { value: 'tan', name: 'Tan' },
  { value: 'tan1', name: 'Tan1' },
  { value: 'tan2', name: 'Tan2' },
  { value: 'tan3', name: 'Tan3' },
  { value: 'tan4', name: 'Tan4' },
  { value: 'tan5', name: 'Tan5' },
]

const recurrencePattern = [
  { name: 'None', value: 'none' },
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
    textAlign: 'center',
  },
  buttonGroup: {
    height: '100%',
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
  },
  apptLabel: {
    textAlign: 'left',
    paddingLeft: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
  },
  apptSubLabel: {
    textAlign: 'right',
    fontSize: '.85rem',
    paddingTop: theme.spacing.unit,
  },
})

const DATETIME_KEY = {
  START: 'start',
  END: 'end',
}

// const _dateTimeFormat = 'DD MMM YYYY'

// const Form = ({
//   classes,
//   slotInfo,
//   handleCreatePatientClick,
//   handleSearchClick,
//   isLoading,
//   values,
// }) =>

@withFormik({
  enableReinitialize: true,
  // validationSchema: ValidationSchema,
  handleSubmit: (values, { props, resetForm }) => {
    const {
      patientName,
      contactNo,
      startDate,
      endDate,
      startTime,
      endTime,
      appointmentType = '',
    } = values
    const { handleAddEvents, slotInfo } = props
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

    handleAddEvents({
      ...slotInfo,
      tooltip: `${patientName}(${contactNo})`,
      start: _nativeStartDate,
      end: _nativeEndDate,
      title: `${patientName}(${contactNo})`,
      color: getColorByAppointmentType(appointmentType),
    })
    resetForm()

    // const _nativeStartDate = Date.parse(startDate)
    // console.log({ _nativeStartDate })
  },
  mapPropsToValues: (props) => {
    const { slotInfo } = props
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
    const _dateStartDate = new Date(startDate)
    console.log({ startDate, startTime, _dateStartDate })
    return {
      startDate,
      startTime,
      endDate,
      endTime,
    }
  },
})
class Form extends React.PureComponent {
  render () {
    const {
      classes,
      slotInfo,
      handleCreatePatientClick,
      handleSearchClick,
      isLoading,
      values,
      handleSubmit,
    } = this.props
    console.log('formvalues', values)
    return (
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
                render={(args) => (
                  <AntdInput
                    {...args}
                    autoFocus
                    onPressEnter={handleSearchClick}
                    helpText='Press enter to search'
                    label={formatMessage({
                      id: 'reception.appt.form.patientName',
                    })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={5}>
              <div className={classnames(classes.buttonGroup)}>
                <Button size='sm' color='primary' onClick={handleSearchClick}>
                  Search
                </Button>
                <Button
                  size='sm'
                  color='primary'
                  onClick={handleCreatePatientClick}
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
                    label={formatMessage({ id: 'reception.appt.form.remarks' })}
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
                    label={formatMessage({ id: 'reception.appt.form.doctor' })}
                  />
                )}
              />
            </GridItem>

            <GridItem xs md={6}>
              <FastField
                name='appointmentType'
                render={(args) => (
                  <AppointmentTypeSelector {...args} label='Appointment Type' />
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
        </GridContainer>
        <Button onClick={handleSubmit} color='success'>
          Add
        </Button>
      </Paper>
    )
  }
}

const FormComponent = withStyles(styles, { name: 'AppointmentFormComponent' })(
  Form,
)

export default FormComponent
