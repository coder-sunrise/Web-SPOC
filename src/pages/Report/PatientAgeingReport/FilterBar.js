import React from 'react'
// formik
import { FastField } from 'formik'
// common componets
import { formatMessage } from 'umi'
import {
  Button,
  GridContainer,
  GridItem,
  SizeContainer,
  Select,
  TextField,
} from '@/components'
import { month, year } from '@/utils/codes'

const FilterBar = ({ handleSubmit, isSubmitting }) => {
  return (
    <SizeContainer size='sm'>
      <GridContainer>
        <GridContainer allignItems='flex-end'>
          <GridItem md={4}>
            <FastField
              name='patientCriteria'
              render={args => (
                <TextField
                  {...args}
                  label={formatMessage({
                    id: 'reception.queue.patientSearchPlaceholder',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem md={1} />
          <GridItem md={1}>
            <FastField
              name='month'
              render={args => {
                return <Select label='Month' options={month} {...args} />
              }}
            />
          </GridItem>
          <GridItem md={1}>
            <FastField
              name='year'
              render={args => {
                return <Select label='Year' options={year} {...args} />
              }}
            />
          </GridItem>
          <GridItem md={2} style={{ marginBottom: 8, marginTop: 8 }}>
            <Button
              color='primary'
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Generate Report
            </Button>
          </GridItem>
        </GridContainer>
      </GridContainer>
    </SizeContainer>
  )
}

export default FilterBar
