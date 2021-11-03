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
  fromDateCols = 2,
  toDateCols = 2,
}) => {
  const onDateChange = value => {
    if (onChange) onChange(value)
  }

  return (
    <React.Fragment>
      <GridItem md={fromDateCols}>
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
                // fix alignment issue
                style={{ position: 'relative', top: '-3px' }}
                label={fromDateLabel}
                disabled={disabled}
                onChange={_onChange}
              />
            )
          }}
        />
      </GridItem>
      <GridItem md={toDateCols}>
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
