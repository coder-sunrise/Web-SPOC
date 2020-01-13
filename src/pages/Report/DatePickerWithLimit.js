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
}) => {
  return (
    <Field
      name={fieldName}
      render={(args) => {
        const { field, form } = args
        const { values } = form
        const startDate = values[startDateFieldName]
        const maximumDateLimit = moment(startDate).add(limit.number, limit.type)
        return (
          <DatePicker
            {...args}
            label={label}
            disabledDate={(date) => date.isAfter(maximumDateLimit)}
          />
        )
      }}
    />
  )
}

export default DatePickerWithLimit
