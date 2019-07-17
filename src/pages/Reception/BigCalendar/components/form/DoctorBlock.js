import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import * as Yup from 'yup'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import { Divider, Paper, withStyles } from '@material-ui/core'
// common components
import {
  Button,
  Checkbox,
  GridContainer,
  GridItem,
  Select,
  DatePicker,
  TimePicker,
  TextField,
  NumberInput,
  RadioGroup,
} from '@/components'
// sub components
import Recurrence from './Recurrence'
import style from './style'

const STYLES = (theme) => ({
  ...style,
  paperContainer: {
    padding: theme.spacing.unit,
  },
  buttonContainer: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px ${theme.spacing
      .unit}px`,
  },
})

const _dateFormat = 'DD MMM YYYY'
const _timeFormat = 'hh:mm a'
const doctors = [
  { value: 'medisys', name: 'Medisys' },
  { value: 'levinne', name: 'Dr Levinne' },
  { value: 'cheah', name: 'Dr Cheah' },
  { value: 'tan', name: 'Dr Tan' },
  { value: 'lim', name: 'Dr Lim' },
  { value: 'liu', name: 'Dr Liu' },
]

const eventType = [
  { value: 'family day', name: 'Family Day' },
  { value: 'vacation', name: 'Vacation' },
  { value: 'on leave', name: 'On Leave' },
]

const durationHours = [
  { value: '0', name: 0 },
  { value: '1', name: 1 },
  { value: '2', name: 2 },
  { value: '3', name: 3 },
  { value: '4', name: 4 },
  { value: '5', name: 5 },
  { value: '6', name: 6 },
  { value: '7', name: 7 },
  { value: '8', name: 8 },
]

const durationMinutes = [
  { value: '0', name: 0 },
  { value: '15', name: 15 },
  { value: '30', name: 30 },
  { value: '45', name: 45 },
]

const RECURRENCE_RANGE = {
  AFTER: 'after',
  BY: 'by',
}

const recurrencePattern = [
  { name: 'Daily', value: 'daily' },
  { name: 'Weekly', value: 'weekly' },
  { name: 'Monthly', value: 'wonthly' },
]

function DoctorEventForm ({
  classes,
  handleSubmit,
  onClose,
  values,
  footer,
  ...props
}) {
  return (
    <React.Fragment>
      <GridContainer justify='center'>
        <GridItem xs md={12}>
          <FastField
            name='doctor'
            render={(args) => (
              <Select {...args} allowClear label='Doctor' options={doctors} />
            )}
          />
        </GridItem>
        <GridContainer item xs md={12} justify='center'>
          <GridItem xs md={8}>
            <FastField
              name='eventDate'
              render={(args) => (
                <DatePicker {...args} label='Date' format={_dateFormat} />
              )}
            />
          </GridItem>
          <GridItem xs md={4}>
            <FastField
              name='eventTime'
              render={(args) => (
                <TimePicker
                  {...args}
                  label='Time'
                  format={_timeFormat}
                  use12Hours
                />
              )}
            />
          </GridItem>
        </GridContainer>
        <GridContainer item xs md={12} justify='center'>
          <GridItem xs md={6}>
            <FastField
              name='durationHour'
              render={(args) => (
                <Select {...args} label='Hour' options={durationHours} />
              )}
            />
          </GridItem>
          <GridItem xs md={6}>
            <FastField
              name='durationMinute'
              render={(args) => (
                <Select {...args} label='Minute: ' options={durationMinutes} />
              )}
            />
          </GridItem>
        </GridContainer>

        <GridItem xs md={12}>
          <FastField
            name='eventType'
            render={(args) => (
              <Select {...args} label='Event Type' options={eventType} />
            )}
          />
        </GridItem>
        <GridItem xs md={12}>
          <FastField
            name='remarks'
            render={(args) => (
              <TextField {...args} label='Remarks' multiline rowsMax={4} />
            )}
          />
        </GridItem>
        <GridItem
          xs
          md={12}
          className={classnames(classes.enableOccurenceCheckbox)}
        >
          <FastField
            name='enableRecurrence'
            render={(args) => {
              return <Checkbox simple label='Enable Recurrence' {...args} />
            }}
          />
        </GridItem>
        {values.enableRecurrence && (
          <Recurrence values={values} isDoctorBlock />
        )}
      </GridContainer>
      {footer &&
        footer({
          confirmText: 'Confirm',
          onConfirm: handleSubmit,
        })}
    </React.Fragment>
  )
}

export default withFormik({
  validationSchema: (props) => props.validationSchema,
  handleSubmit: (values, { props, resetForm }) => {
    const { handleAddDoctorEvent } = props
    const {
      doctor,
      durationHour,
      durationMinute,
      eventDate,
      eventTime,
    } = values

    const date = moment(eventDate).format(_dateFormat)
    const endDate = moment(
      `${date} ${eventTime}`,
      `${_dateFormat} ${_timeFormat}`,
    )
    endDate.add(parseInt(durationHour, 10), 'hours')
    endDate.add(parseInt(durationMinute, 10), 'minutes')

    const startDate = moment(
      `${date} ${eventTime}`,
      `${_dateFormat} ${_timeFormat}`,
    )

    const event = {
      ...values,
      startTime: startDate.format(_timeFormat),
      endTime: endDate.format(_timeFormat),
      start: startDate.toDate(),
      end: endDate.toDate(),
      isDoctorEvent: true,
      resourceId: doctor,
    }

    resetForm()
    handleAddDoctorEvent(event)
  },
  mapPropsToValues: ({ initialProps }) => ({
    doctor: undefined,
    durationHour: '0',
    durationMinute: '15',
    eventDate: '',
    eventTime: '',
    subject: '',
    description: '',
    occurence: 0,
    enableRecurrence: false,
    recurrencePattern: 'daily',
    recurrenceRange: RECURRENCE_RANGE.AFTER,
    ...initialProps,
  }),
})(withStyles(STYLES, { name: 'DoctorForm' })(DoctorEventForm))
