import React from 'react'
import moment from 'moment'
// formik
import { Field } from 'formik'
// components
import { GridItem, DatePicker } from '@/components'
import DatePickerWithLimit from './DatePickerWithLimit'

const ReportDateRangePicker = ({
  fromDateLabel = 'From',
  toDateLabel = 'To',
  fromDateFieldName = 'dateFrom',
  toDateFieldName = 'dateTo',
  limit = { number: 1, type: 'year' },
  onChange,
  disabled = false,
  fromDateWidth = 2,
  toDateWidth = 2,
}) => {
  const onDateChange = value => {
    if (onChange) onChange(value)
  }

  return (
    <React.Fragment>
      <GridItem md={fromDateWidth}>
        <Field
          name={fromDateFieldName}
          render={args => {
            const { form } = args
            const _onChange = value => {
              const endDate = form.values[toDateFieldName]
              const maxDate = moment(value).add(limit.number, limit.type)

              if (endDate && moment(endDate).isAfter(maxDate)) {
                const maxDateInString = maxDate.formatUTC()
                form.setFieldValue(toDateFieldName, maxDateInString)
              }
              onDateChange(value)
            }
            return (
              <DatePicker
                {...args}
                label={fromDateLabel}
                disabled={disabled}
                onChange={_onChange}
              />
            )
          }}
        />
      </GridItem>
      <GridItem md={toDateWidth}>
        <DatePickerWithLimit
          label={toDateLabel}
          fieldName={toDateFieldName}
          startDateFieldName={fromDateFieldName}
          limit={limit}
          disabled={disabled}
        />
      </GridItem>
    </React.Fragment>
  )
}

export default ReportDateRangePicker
