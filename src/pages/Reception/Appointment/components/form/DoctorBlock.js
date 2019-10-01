import React, { useState } from 'react'
import { compose } from 'redux'
import moment from 'moment'
import * as Yup from 'yup'
import { connect } from 'dva'
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
  CodeSelect,
  Select,
  DatePicker,
  TimePicker,
  SizeContainer,
  TextField,
  dateFormatLong,
  timeFormat24Hour,
} from '@/components'
// import Recurrence from './Recurrence'
import {
  Recurrence,
  DoctorProfileSelect,
  computeRRule,
} from '@/components/_medisys'
import { filterRecurrenceDto } from './formikUtils'
// styles
import style from './style'
// assets
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
})

// const dateFormatLong = { dateFormatLong }
const _timeFormat = 'hh:mm a'

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

const convertReccurenceDaysOfTheWeek = (week = '') =>
  week !== null
    ? week.split(', ').map((eachDay) => parseInt(eachDay, 10))
    : week

const DoctorEventForm = ({ classes, handleSubmit, values, errors, footer }) => {
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
    <div style={{ padding: 8 }}>
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
              <DoctorProfileSelect
                {...args}
                valueField='clinicianProfile.userProfileFK'
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
                  format={dateFormatLong}
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
                <Select {...args} label='Minute' options={durationMinutes} />
              )}
            />
          </GridItem>
        </GridContainer>
        <GridItem xs md={12}>
          <FastField
            name='remarks'
            render={(args) => (
              <TextField {...args} label='Remarks' multiline rowsMax={4} />
            )}
          />
        </GridItem>

        <GridItem md={12}>
          <Recurrence
            block
            disabled={values.id !== undefined}
            formValues={values}
            recurrenceDto={values.recurrenceDto}
          />
        </GridItem>
      </GridContainer>
      {footer &&
        footer({
          confirmText: 'Confirm',
          onConfirm: handleSubmit,
          extraButtons: <Button color='success'>Check Availability</Button>,
        })}
    </div>
  )
}

const generateRecurringDoctorBlock = (recurrenceDto, doctorBlock) => {
  const rrule = computeRRule({ recurrenceDto, date: doctorBlock.eventDate })
  if (rrule) {
    const allDates = rrule.all() || []
    const { id, ...restDoctorBlockValues } = doctorBlock
    return allDates.map((date) => ({
      ...restDoctorBlockValues,
      eventDate: date,
    }))
  }
  return []
}

const initDailyRecurrence = {
  recurrencePatternFK: 1,
  recurrenceFrequency: 1,
  recurrenceRange: 'after',
  recurrenceCount: 1,
  recurrenceDaysOfTheWeek: undefined,
  recurrenceDayOfTheMonth: undefined,
}

export default compose(
  withStyles(STYLES, { name: 'DoctorForm' }),
  connect(({ doctorBlock }) => ({
    currentViewDoctorBlock: doctorBlock.currentViewDoctorBlock,
  })),
  withFormik({
    enableReinitialize: true,
    validationSchema: ({ validationSchema = Yup.object().shape({}) }) =>
      validationSchema,
    handleSubmit: (values, { props, resetForm }) => {
      const { dispatch, onClose } = props

      const {
        restDoctorBlock,
        doctorBlockUserFk,
        isEnableRecurrence,
        durationHour,
        durationMinute,
        eventDate,
        eventTime,
        remarks,
        recurrenceDto,
        ...restValues
      } = values

      try {
        const doctorBlock = {
          ...restDoctorBlock,
          eventDate,
          eventTime,
          recordClinicFK: 1,
          doctorBlockUserFk,
          remarks,
          // startDateTime: startDate.formatUTC(),
          // endDateTime: endDate.formatUTC(),
        }
        // generate recurrence
        let doctorBlocks = [
          doctorBlock,
        ]
        if (isEnableRecurrence && restValues.id === undefined) {
          doctorBlocks = generateRecurringDoctorBlock(
            recurrenceDto,
            doctorBlock,
          )
        }

        // compute startTime and endTime on all recurrence
        doctorBlocks = doctorBlocks.map((item) => {
          const { eventDate: date, eventTime: time, ...rest } = item
          console.log({
            date,
            dateFormatLong,
            time,
            durationHour,
            durationMinute,
          })
          const doctorBlockDate = moment(date).format(dateFormatLong)

          const endDate = moment(
            `${doctorBlockDate} ${time}`,
            `${dateFormatLong} ${_timeFormat}`,
          )
          endDate.add(parseInt(durationHour, 10), 'hours')
          endDate.add(parseInt(durationMinute, 10), 'minutes')

          const startDate = moment(
            `${doctorBlockDate} ${time}`,
            `${dateFormatLong} ${_timeFormat}`,
          )
          // console.log({
          //   startDate,
          //   endDate: endDate.format(),
          //   endDateUTC: endDate.formatUTC(false),
          // })
          return {
            ...rest,
            startDateTime: startDate.formatUTC(false),
            endDateTime: endDate.formatUTC(false),
          }
        })

        let payload = {
          doctorBlockUserFk,
          isEnableRecurrence,
          doctorBlocks,
          recordClinicFK: 1,
          ...restValues,
        }
        if (isEnableRecurrence)
          payload = {
            ...payload,
            recurrenceDto: filterRecurrenceDto(recurrenceDto),
          }
        console.log({ payload })

        dispatch({
          type: restValues.id ? 'doctorBlock/update' : 'doctorBlock/upsert',
          payload,
        }).then((response) => {
          if (response) {
            dispatch({
              type: 'calendar/refresh',
            })
            resetForm()
            onClose()
          }
        })
      } catch (error) {
        console.log({ error })
      }
    },
    mapPropsToValues: ({ currentViewDoctorBlock }) => {
      if (Object.keys(currentViewDoctorBlock).length > 0) {
        const {
          doctorBlocks,
          recurrenceDto,
          ...restValues
        } = currentViewDoctorBlock
        const doctorBlock = doctorBlocks[0]
        const start = moment(doctorBlock.startDateTime)
        const end = moment(doctorBlock.endDateTime)
        const [
          hour,
          minute,
        ] = end.format(timeFormat24Hour).split(':')
        const durationHour = end.diff(start, 'hour')
        const durationMinute = end.format()
        console.log({ hour, minute, doctorBlock })
        return {
          ...restValues,
          eventDate: start.format(dateFormatLong),
          eventTime: start.format(_timeFormat),
          durationHour: hour,
          durationMinute: minute,
          restDoctorBlock: { ...doctorBlock },
          remarks: doctorBlock.remarks,
          recurrenceDto:
            recurrenceDto !== null && recurrenceDto !== undefined
              ? {
                  ...recurrenceDto,
                  recurrenceDaysOfTheWeek: convertReccurenceDaysOfTheWeek(
                    recurrenceDto.recurrenceDaysOfTheWeek,
                  ),
                }
              : { ...initDailyRecurrence },
        }
      }
      return {
        doctorBlockUserFk: undefined,
        recordClinicFK: 1,
        durationHour: '0',
        durationMinute: '15',
        eventDate: moment(),
        eventTime: undefined,
        startDateTime: '',
        endDateTime: '',
        remarks: '',
        isEnableRecurrence: false,
        recurrenceDto: { ...initDailyRecurrence },
      }
    },
  }),
)(DoctorEventForm)
