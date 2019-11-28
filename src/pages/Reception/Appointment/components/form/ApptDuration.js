import React, { memo, useState, useEffect } from 'react'
import moment from 'moment'
import _ from 'lodash'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import {
  timeFormat,
  TextField,
  Field,
  FastField,
  GridContainer,
  GridItem,
  CodeSelect,
  Select,
  Button,
  Tabs,
  CommonTableGrid,
  Popconfirm,
  Tooltip,
} from '@/components'

const hourOptions = [
  { name: '0 HR', value: 0 },
  { name: '1 HR', value: 1 },
  { name: '2 HR', value: 2 },
  { name: '3 HR', value: 3 },
  { name: '4 HR', value: 4 },
  { name: '5 HR', value: 5 },
  { name: '6 HR', value: 6 },
  { name: '7 HR', value: 7 },
  { name: '8 HR', value: 8 },
]
const minuteOptions = [
  { name: '0 MINS', value: 0 },
  { name: '5 MINS', value: 5 },
  { name: '10 MINS', value: 10 },
  { name: '15 MINS', value: 15 },
  { name: '20 MINS', value: 20 },
  { name: '25 MINS', value: 25 },
  { name: '30 MINS', value: 30 },
  { name: '35 MINS', value: 35 },
  { name: '40 MINS', value: 40 },
  { name: '45 MINS', value: 45 },
  { name: '50 MINS', value: 50 },
  { name: '55 MINS', value: 55 },
]
const setEndTime = (row) => {
  console.log('setEndTime')
  const { startTime, apptDurationHour = 0, apptDurationMinute = 0 } = row
  if (startTime) {
    const startMoment = moment(startTime, 'HH:mm:ss')
    row.endTime = startMoment
      .add(apptDurationHour, 'hour')
      .add(apptDurationMinute, 'minute')
      .format('HH:mm:ss')
  } else row.endTime = undefined

  console.log(row)
}
const ApptDuration = ({ row, columnConfig, cellProps }) => {
  const { value, control, validSchema, ...restProps } = columnConfig
  const { onBlur, onFocus, autoFocus, ...props } = cellProps
  // console.log(restProps, props)
  const [
    blur,
    setBlur,
  ] = useState(false)
  const debounceBlur = _.debounce(setBlur, 100, {
    leading: false,
    trailing: true,
  })
  useEffect(
    () => {
      if (blur) {
        if (onBlur) onBlur()
      }
    },
    [
      blur,
    ],
  )
  return (
    <GridContainer>
      <GridItem xs={6}>
        <Select
          value={row.apptDurationHour}
          options={hourOptions}
          {...restProps}
          onChange={(e) => {
            const { commitChanges } = control
            row.apptDurationHour = e
            setEndTime(row)
            validSchema(row)

            commitChanges({
              changed: {
                [row.id]: {
                  endTime: row.endTime,
                },
              },
            })
          }}
          onBlur={() => {
            debounceBlur(true)
          }}
          onFocus={() => {
            debounceBlur(false)
          }}
        />
      </GridItem>
      <GridItem xs={6}>
        <Select
          value={row.apptDurationMinute}
          options={minuteOptions}
          {...restProps}
          onChange={(e) => {
            const { commitChanges } = control
            row.apptDurationMinute = e
            setEndTime(row)
            validSchema(row)
            commitChanges({
              changed: {
                [row.id]: {
                  endTime: row.endTime,
                },
              },
            })
          }}
          onBlur={() => {
            debounceBlur(true)
          }}
          onFocus={() => {
            debounceBlur(false)
          }}
        />
      </GridItem>
    </GridContainer>
  )
}
export default memo(ApptDuration)
