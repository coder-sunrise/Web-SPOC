import React from 'react'
import { compose } from 'redux'
import moment from 'moment'
import * as Yup from 'yup'
import { connect } from 'dva'
// formik
import { FastField, Field } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  Button,
  GridContainer,
  GridItem,
  Select,
  DatePicker,
  TimePicker,
  TextField,
  dateFormatLong,
  withFormikExtend,
} from '@/components'
// import Recurrence from './Recurrence'
import {
  Recurrence,
  DoctorProfileSelect,
  computeRRule,
} from '@/components/_medisys'
import { filterRecurrenceDto } from './formUtils'
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
  footer: {
    marginTop: theme.spacing(2),
  },
  confirmationButtons: {
    textAlign: 'right',
  },
  confirm: {
    marginRight: '0px !important',
  },
})

// const dateFormatLong = { dateFormatLong }
const _timeFormat = 'hh:mm a'

const durationHours = [
  { value: '0', name: '0' },
  { value: '1', name: '1' },
  { value: '2', name: '2' },
  { value: '3', name: '3' },
  { value: '4', name: '4' },
  { value: '5', name: '5' },
  { value: '6', name: '6' },
  { value: '7', name: '7' },
  { value: '8', name: '8' },
]

const durationMinutes = [
  { value: '0', name: '0' },
  { value: '15', name: '15' },
  { value: '30', name: '30' },
  { value: '45', name: '45' },
]

const convertReccurenceDaysOfTheWeek = (week = '') =>
  week !== null
    ? week.split(', ').map((eachDay) => parseInt(eachDay, 10))
    : week

const DoctorEventForm = ({
  classes,
  dispatch,
  handleSubmit,
  values,
  onClose,
}) => {
  const handleDelete = () => {
    dispatch({
      type: 'doctorBlock/delete',
      payload: {
        cfg: { message: 'Deleted doctor block' },
        id: values.doctorBlockFK,
      },
    }).then(() => {
      onClose()

      if (window.location) {
        const { pathname } = window.location
        if (pathname === '/reception/appointment')
          dispatch({
            type: 'calendar/refresh',
          })
        else
          dispatch({
            type: 'doctorBlock/refresh',
          })
      }
    })
  }

  return (
    <div style={{ padding: 8 }}>
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
        </GridContainer>
        <GridContainer item xs md={12}>
          <GridItem xs md={4}>
            <FastField
              name='durationHour'
              render={(args) => (
                <Select {...args} label='Hour(s)' options={durationHours} />
              )}
            />
          </GridItem>
          <GridItem xs md={4}>
            <FastField
              name='durationMinute'
              render={(args) => (
                <Select {...args} label='Minute(s)' options={durationMinutes} />
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
      <GridContainer className={classes.footer}>
        <GridItem md={2}>
          {values.id && (
            <Button color='danger' onClick={handleDelete}>
              Delete
            </Button>
          )}
        </GridItem>
        <GridItem md={10} className={classes.confirmationButtons}>
          <Button color='danger' onClick={onClose}>
            Cancel
          </Button>
          <Button
            className={classes.confirm}
            color='primary'
            onClick={handleSubmit}
          >
            Confirm
          </Button>
        </GridItem>
      </GridContainer>
      {/* footer &&
        footer({
          confirmText: 'Confirm',
          onConfirm: handleSubmit,
        }) */}
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
  withFormikExtend({
    displayName: 'DoctorBlockForm',
    notDirtyDuration: 0.1,
    enableReinitialize: true,
    validationSchema: ({ validationSchema = Yup.object().shape({}) }) =>
      validationSchema,
    handleSubmit: (values, { props, resetForm }) => {
      const { dispatch, onClose, handleAfterSubmit } = props
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
        dispatch({
          type: restValues.id ? 'doctorBlock/update' : 'doctorBlock/upsert',
          payload,
        }).then((response) => {
          if (response) {
            if (handleAfterSubmit) {
              handleAfterSubmit()
            }
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
        const hour = end.diff(start, 'hour')
        // const minute = end.format(timeFormat24Hour).split(':')[1]
        const minute = (end.diff(start, 'minute') / 60 - hour) * 60

        return {
          ...restValues,
          doctorBlockFK: doctorBlock.id,
          eventDate: start.formatUTC(),
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
        eventDate: moment().formatUTC(),
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
