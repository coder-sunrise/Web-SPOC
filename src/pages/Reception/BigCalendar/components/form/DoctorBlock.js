import React, { useState } from 'react'
import moment from 'moment'
import * as Yup from 'yup'
// formik
import { FastField, Field, withFormik } from 'formik'
// material ui
import { Popover, withStyles } from '@material-ui/core'
import Info from '@material-ui/icons/Info'
// common components
import {
  Button,
  GridContainer,
  GridItem,
  Select,
  CodeSelect,
  DatePicker,
  TimePicker,
  SizeContainer,
  TextField,
} from '@/components'
// sub components
import Recurrence from './Recurrence'
import { getUniqueGUID } from '@/utils/utils'
import style from './style'
import { tooltip } from '@/assets/jss/index'

const STYLES = (theme) => ({
  ...style,
  tooltip: {
    ...tooltip,
    padding: '10px 5px',
    background: '#4f4f4f',
    maxWidth: 400,
    textAlign: 'left',
    fontSize: '0.85rem',
  },
  popover: {
    pointerEvents: 'none',
  },

  paperContainer: {
    padding: theme.spacing.unit,
  },
  conflictIcon: {
    marginTop: 'auto',
    marginBottom: theme.spacing(0.5),
  },
  checkAvailabilityBtn: {
    position: 'absolute',
    left: theme.spacing(2),
  },
})

const _dateFormat = 'DD MMM YYYY'
const _timeFormat = 'hh:mm a'

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

const DoctorEventForm = ({
  classes,
  handleSubmit,
  onClose,
  values,
  footer,
  ...props
}) => {
  const { hasConflict } = values
  const [
    anchorEl,
    setAnchorEl,
  ] = useState(null)

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const showPopup = Boolean(anchorEl)

  return (
    <React.Fragment>
      <Popover
        id='event-popup'
        className={classes.popover}
        open={showPopup}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        placement='top-start'
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        disableRestoreFocus
      >
        <div className={classes.tooltip}>
          <ul>
            <li>
              The selected slot: 26 July 2019 11:45AM - 12:00PM already had an
              appointment with: Tan Mei Ling
            </li>
          </ul>
        </div>
      </Popover>
      <GridContainer>
        <GridItem xs md={12}>
          <Field
            name='doctorBlockUserFk'
            render={(args) => (
              <CodeSelect
                {...args}
                label='Doctor'
                code='doctorprofile'
                labelField='clinicianInfomation.name'
                allowClear
              />
            )}
          />
        </GridItem>
        <GridContainer item xs md={12}>
          <GridItem xs md={4}>
            <FastField
              name='eventDate'
              render={(args) => (
                <DatePicker
                  {...args}
                  label='Date'
                  allowClear={false}
                  format={_dateFormat}
                />
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
          {hasConflict && (
            <GridItem md={1} className={classes.conflictIcon}>
              <SizeContainer size='lg'>
                <Info
                  color='error'
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                />
              </SizeContainer>
            </GridItem>
          )}
        </GridContainer>
        <GridContainer item xs md={12}>
          <GridItem xs md={4}>
            <FastField
              name='durationHour'
              render={(args) => (
                <Select {...args} label='Hour' options={durationHours} />
              )}
            />
          </GridItem>
          <GridItem xs md={4}>
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

        <GridItem md={12}>
          <Recurrence values={values} isDoctorBlock />
        </GridItem>
      </GridContainer>
      {footer &&
        footer({
          confirmText: 'Confirm',
          onConfirm: handleSubmit,
          extraButtons: (
            <Button className={classes.checkAvailabilityBtn} color='success'>
              Check Availability
            </Button>
          ),
        })}
    </React.Fragment>
  )
}

export default withFormik({
  validationSchema: ({ validationSchema = Yup.object().shape({}) }) =>
    validationSchema,
  handleSubmit: (values, { props, resetForm }) => {
    const { handleUpdateDoctorEvent, initialProps } = props

    const { type = 'add' } = initialProps
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
    const _appointmentID =
      values._appointmentID !== undefined
        ? values._appointmentID
        : getUniqueGUID()

    const event = {
      ...values,
      _appointmentID,
      // startTime: startDate.format(_timeFormat),
      // endTime: endDate.format(_timeFormat),
      start: startDate.toDate(),
      end: endDate.toDate(),
      isDoctorEvent: true,
      resourceId: doctor,
    }

    handleUpdateDoctorEvent({
      [type]: event,
    })
    // todo: update doctor event
    resetForm()
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
