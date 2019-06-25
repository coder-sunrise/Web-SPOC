import React from 'react'
// formik
import { FastField } from 'formik'
// common component
import {
  DatePicker,
  GridContainer,
  GridItem,
  NumberInput,
  RadioGroup,
} from '@/components'
import { RECURRENCE_RANGE } from './variables'

const RecurrenceDaily = ({ values }) => {
  return (
    <GridContainer item xs md={8}>
      <GridItem md={6}>
        <FastField
          name='every'
          render={(args) => (
            <NumberInput label='Every' {...args} suffix='day(s)' />
          )}
        />
      </GridItem>
      <GridContainer item md={12}>
        <GridItem md={6}>
          <FastField
            name='recurrenceRange'
            render={(args) => (
              <RadioGroup
                label='Range of Recurrence'
                textField='name'
                options={[
                  {
                    value: RECURRENCE_RANGE.AFTER,
                    name: 'End After',
                  },
                  {
                    value: RECURRENCE_RANGE.BY,
                    name: 'End By',
                  },
                ]}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem md={6}>
          {values.recurrenceRange === RECURRENCE_RANGE.AFTER && (
            <FastField
              name='occurence'
              render={(args) => <NumberInput {...args} label='Occurence' />}
            />
          )}
          {values.recurrenceRange === RECURRENCE_RANGE.BY && (
            <FastField
              name='stopDate'
              render={(args) => <DatePicker {...args} label='Stop Date' />}
            />
          )}
        </GridItem>
      </GridContainer>
    </GridContainer>
  )
}

export default RecurrenceDaily
