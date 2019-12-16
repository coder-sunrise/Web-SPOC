import React from 'react'
// formik
import { FastField } from 'formik'
import { formatMessage } from 'umi/locale'
// common components
import {
  Button,
  Checkbox,
  DatePicker,
  GridContainer,
  GridItem,
  TextField,
  NumberInput,
  SizeContainer,
  Field,
} from '@/components'
// medisys components
import { DoctorProfileSelect } from '@/components/_medisys'

const FilterBar = ({ handleSubmit, values, isSubmitting }) => {
  return (
    <SizeContainer size='sm'>
      <GridContainer>
        <GridContainer alignItems='flex-end'>
          {/* 1st row  */}
          <GridItem md={4}>
            <FastField
              name='patientCriteria'
              render={(args) => (
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
              name='ageFrom'
              render={(args) => (
                <NumberInput
                  {...args}
                  label='Age From'
                  max={200}
                  precision={0}
                />
              )}
            />
          </GridItem>
          <GridItem md={1}>
            <FastField
              name='ageTo'
              render={(args) => (
                <NumberInput {...args} label='Age To' max={200} precision={0} />
              )}
            />
          </GridItem>
          <GridItem md={5} />
          {/* 2nd row  */}
          <GridItem md={2}>
            <Field
              name='dateFrom'
              render={(args) => (
                <DatePicker
                  {...args}
                  disabled={values.isAllDate}
                  label='Visit Date From'
                />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <Field
              name='dateTo'
              render={(args) => (
                <DatePicker
                  {...args}
                  disabled={values.isAllDate}
                  label='Visit Date To'
                />
              )}
            />
          </GridItem>
          <GridItem md={1}>
            <FastField
              name='isAllDate'
              render={(args) => <Checkbox {...args} label='All Date' />}
            />
          </GridItem>

          <GridItem md={2}>
            <FastField
              name='noVisitDateFrom'
              render={(args) => <DatePicker {...args} label='No Visit Since' />}
            />
          </GridItem>
          <GridItem md={4} />
          <GridItem md={2}>
            <FastField
              name='doctorIDs'
              render={(args) => (
                <DoctorProfileSelect
                  mode='multiple'
                  {...args}
                  allValue={-99}
                  allValueOption={{
                    id: -99,
                    clinicianProfile: {
                      name: 'All',
                    },
                  }}
                  labelField='clinicianProfile.name'
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <FastField
              name='isGroupByDoctor'
              render={(args) => <Checkbox {...args} label='Group By Doctor' />}
            />
          </GridItem>
          <GridItem md={2}>
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
