import React, { PureComponent } from 'react'
import _ from 'lodash'
import moment from 'moment'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  DatePicker,
  TimePicker,
  dateFormatLong,
  timeFormat24Hour,
  Select,
} from '@/components'

// import Recurrence from '@/pages/Reception/BigCalendar/components/form/Recurrence'
import { Recurrence, computeRRule } from '@/components/_medisys'
import { filterRecurrenceDto } from '@/pages/Reception/Appointment/components/form/formUtils'

const styles = (theme) => ({})

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
const _timeFormat = 'hh:mm a'

const durationMinutes = [
  { value: '0', name: 0 },
  { value: '15', name: 15 },
  { value: '30', name: 30 },
  { value: '45', name: 45 },
]

const initDailyRecurrence = {
  recurrencePatternFK: 1,
  recurrenceFrequency: 1,
  recurrenceRange: 'after',
  recurrenceCount: 1,
  recurrenceDaysOfTheWeek: undefined,
  recurrenceDayOfTheMonth: undefined,
}

const convertReccurenceDaysOfTheWeek = (week = '') =>
  week !== null
    ? week.split(', ').map((eachDay) => parseInt(eachDay, 10))
    : week

const generateRecurringRoomBlock = (recurrenceDto, roomBlock) => {
  const rrule = computeRRule({ recurrenceDto, date: roomBlock.eventDate })
  if (rrule) {
    const allDates = rrule.all() || []
    const { id, ...restRoomBlockValues } = roomBlock
    return allDates.map((date) => ({
      ...restRoomBlockValues,
      eventDate: date,
    }))
  }
  return []
}

@withFormikExtend({
  mapPropsToValues: ({ roomBlock }) => {
    const { currentViewRoomBlock } = roomBlock
    if (currentViewRoomBlock && Object.keys(currentViewRoomBlock).length > 0) {
      const { recurrenceDto, ...restValues } = currentViewRoomBlock
      const selectedRoomBlock = currentViewRoomBlock.roomBlock[0]
      const start = moment(selectedRoomBlock.startDateTime)
      const end = moment(selectedRoomBlock.endDateTime)
      const hour = end.diff(start, 'hour')
      const minute = end.format(timeFormat24Hour).split(':')[1]

      return {
        ...restValues,
        eventDate: start.formatUTC(),
        eventTime: start.format(_timeFormat),
        durationHour: hour,
        durationMinute: minute,
        restRoomBlock: { ...selectedRoomBlock },
        remarks: selectedRoomBlock.remarks,
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
      roomBlockGroupFK: undefined,
      // recordClinicFK: 1,
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
  validationSchema: Yup.object().shape(
    {
      // code: Yup.string().required(),
      // displayValue: Yup.string().required(),
      // effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
    },
  ),
  handleSubmit: (values, { props, resetForm }) => {
    console.log('submit')
    const { dispatch, onClose, onConfirm } = props
    const {
      restRoomBlock,
      roomBlockGroupFK,
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
      const roomBlock = {
        ...restRoomBlock,
        eventDate,
        eventTime,
        recordClinicFK: 1,
        roomBlockGroupFK,
        remarks,
        // startDateTime: startDate.formatUTC(),
        // endDateTime: endDate.formatUTC(),
      }
      // generate recurrence
      let roomBlocks = [
        roomBlock,
      ]

      if (isEnableRecurrence && restValues.id === undefined) {
        roomBlocks = generateRecurringRoomBlock(recurrenceDto, roomBlock)
      }

      // compute startTime and endTime on all recurrence
      roomBlocks = roomBlocks.map((item) => {
        const { eventDate: date, eventTime: time, ...rest } = item
        const roomBlockDate = moment(date).format(dateFormatLong)

        const endDate = moment(
          `${roomBlockDate} ${time}`,
          `${dateFormatLong} ${_timeFormat}`,
        )
        endDate.add(parseInt(durationHour, 10), 'hours')
        endDate.add(parseInt(durationMinute, 10), 'minutes')

        const startDate = moment(
          `${roomBlockDate} ${time}`,
          `${dateFormatLong} ${_timeFormat}`,
        )
        return {
          ...rest,
          startDateTime: startDate.formatUTC(false),
          endDateTime: endDate.formatUTC(false),
        }
      })

      let payload = {
        roomBlockGroupFK,
        isEnableRecurrence,
        roomBlock: roomBlocks,
        recordClinicFK: 1,
        ...restValues,
      }
      if (isEnableRecurrence)
        payload = {
          ...payload,
          recurrenceDto: filterRecurrenceDto(recurrenceDto),
        }
      dispatch({
        type: restValues.id ? 'roomBlock/update' : 'roomBlock/upsert',
        payload,
      }).then((response) => {
        if (response) {
          resetForm()
          if (onConfirm) onConfirm()
          dispatch({
            type: 'roomBlock/query',
          })
        }
      })
    } catch (error) {
      console.log({ error })
    }

    // console.log('check', hours, minutes, eventDate, moment(), endDate, duration)
    // const roomBlock = {
    //   // startDateTime: eventDate + duration,
    //   startDateTime: eventDate,
    //   endDateTime: eventDate,
    //   remarks,
    // }

    // dispatch({
    //   type: 'roomBlock/upsert',
    //   payload: {
    //     ...restValues,
    //     effectiveStartDate: effectiveDates[0],
    //     effectiveEndDate: effectiveDates[1],
    //     roomStatusFK: 1,
    //     roomBlock: [
    //       roomBlock,
    //     ],
    //   },
    // }).then((r) => {
    //   if (r) {
    //     if (onConfirm) onConfirm()
    //     dispatch({
    //       type: 'roomBlock/query',
    //     })
    //   }
    // })
  },
  displayName: 'RoomDetail',
})
class Detail extends PureComponent {
  state = {}

  render () {
    const { props } = this
    const { theme, footer, values } = props
    console.log('props', this.props)
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={12}>
              <FastField
                name='roomFK'
                render={(args) => (
                  <CodeSelect label='Room' code='ctRoom' {...args} />
                )}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='eventDate'
                render={(args) => (
                  <DatePicker
                    {...args}
                    label='Event Date'
                    allowClear={false}
                    format={dateFormatLong}
                  />
                )}
              />
            </GridItem>
            <GridItem md={6}>
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
            {/* <GridItem md={6}>
              <FastField
                name='eventDate'
                render={(args) => (
                  <DatePicker
                    label='Event Date'
                    format={fullDateTime}
                    showTime={{ format: 'HH:mm' }}
                    {...args}
                  />
                )}
              />
            </GridItem> */}

            {/* <GridItem md={6}>
              <FastField
                name='duration'
                render={(args) => {
                  return (
                    <TimePicker use12Hours={false} label='Duration' {...args} />
                  )
                }}
              />
            </GridItem> */}
            <GridItem md={6}>
              <FastField
                name='durationHour'
                render={(args) => (
                  <Select {...args} label='Hour' options={durationHours} />
                )}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='durationMinute'
                render={(args) => (
                  <Select {...args} label='Minute' options={durationMinutes} />
                )}
              />
            </GridItem>
            <GridItem md={12}>
              <FastField
                name='remarks'
                render={(args) => {
                  return (
                    <TextField
                      label='Remarks'
                      multiline
                      rowsMax={4}
                      {...args}
                    />
                  )
                }}
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
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default Detail
