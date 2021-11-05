import React from 'react'
import moment from 'moment'
// formik
import { Field } from 'formik'
// common components
import { DatePicker } from '@/components'

const DatePickerWithLimit = ({
  label = 'To',
  fieldName = 'dateTo',
  startDateFieldName = 'dateFrom',
  limit = { number: 1, type: 'year' }, // default limit is 1 year
  disabled = false,
}) => {
  return (
    <Field
      name={fieldName}
      render={(args) => {
        const { form } = args
        const { values } = form
        const startDate = values[startDateFieldName]
        const maximumDateLimit = moment(startDate).add(limit.number, limit.type)
        return (
          <DatePicker
            {...args}
            label={label}
            // fix alignment issue
            style={{ position: 'relative', top: '-3px' }}
            disabledDate={date => date.isAfter(maximumDateLimit)}
            disabled={disabled}
          />
        )
      }}
    />
  )
}

export default DatePickerWithLimit
