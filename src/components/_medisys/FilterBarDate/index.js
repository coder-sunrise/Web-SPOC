import React from 'react'
import moment from 'moment'
// common components
import { DatePicker } from '@/components'
// utils
import { roundTo } from '@/utils/utils'

const timeCfg = { hour: 0, minute: 0, second: 0 }

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
    const dCopy = moment(d).set(timeCfg)

    if (isEndDate && formValues.startDate) {
      const startDate = formValues.startDate
        ? moment(formValues.startDate).set(timeCfg)
        : undefined

      const diffInYearsString = dCopy.diff(startDate, 'years', true).toFixed(4)
      const diffInYears = parseFloat(diffInYearsString)

      return restrictAfterToday || d.isBefore(startDate) || diffInYears > 1.0
    }

    if (!isEndDate && formValues.endDate) {
      const endDate = formValues.endDate
        ? moment(formValues.endDate).set(timeCfg)
        : undefined

      const diffInYearsString = dCopy.diff(endDate, 'years', true).toFixed(4)
      const diffInYears = parseFloat(diffInYearsString)
      if (d.isSame(moment())) {
        return false
      }

      return (
        restrictAfterToday ||
        d.isAfter(formValues.endDate) ||
        diffInYears < -1.0
      )
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
