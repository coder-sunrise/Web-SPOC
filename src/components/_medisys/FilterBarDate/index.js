import React from 'react'
import moment from 'moment'
// common components
import { DatePicker } from '@/components'
// utils
import { roundTo } from '@/utils/utils'

const FilterBarDate = ({
  label = 'Date',
  formValues = {
    startDate: moment(),
    endDate: moment(),
  },
  isEndDate = false,
  args = {},
  disabledDate,
  noLimit,
  noTodayLimit = false,
  ...restProps
}) => {
  const onChange = (value) => {
    try {
      const { form, field } = args

      if (form && field) {
        let returnValue = value
        if (isEndDate && value && moment(value).isValid()) {
          returnValue = moment(value)
            .set({ hour: 23, minute: 59, second: 59 })
            .formatUTC(false)
        }
        form.setFieldValue(field.name, returnValue)
      }
    } catch (error) {
      console.error({ error })
    }
  }

  const defaultDisabledDate = (d) => {
    const restrictAfterToday = noTodayLimit ? false : d.isAfter(moment())
    if (!d) return true

    if (isEndDate && formValues.startDate) {
      const startDate = formValues.startDate
        ? moment(formValues.startDate)
        : undefined
      const range = moment.duration(d.diff(startDate))
      const years = roundTo(range.asYears())

      return restrictAfterToday || d.isBefore(startDate) || years > 1.0
    }

    if (!isEndDate && formValues.endDate) {
      const endDate = formValues.endDate
        ? moment(formValues.endDate)
        : undefined
      const range = moment.duration(d.diff(endDate))
      const years = roundTo(range.asYears())
      if (d.isSame(moment())) {
        return false
      }

      return restrictAfterToday || d.isAfter(formValues.endDate) || years < -1.0
    }
    return !d || d.isAfter(moment())
  }

  let _disabledDate = disabledDate || defaultDisabledDate
  if (noLimit) _disabledDate = null

  return (
    <DatePicker
      {...args}
      label={label}
      onChange={onChange}
      disabledDate={_disabledDate}
      {...restProps}
    />
  )
}

export default FilterBarDate
