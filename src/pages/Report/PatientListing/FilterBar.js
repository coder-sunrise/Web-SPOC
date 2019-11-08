import React from 'react'
// formik
import { FastField } from 'formik'
// common components
import {
  Button,
  Checkbox,
  CodeSelect,
  DatePicker,
  GridContainer,
  GridItem,
  Select,
  TextField,
  NumberInput,
  SizeContainer,
} from '@/components'
// medisys components
import { DoctorLabel, DoctorProfileSelect } from '@/components/_medisys'

const FilterBar = ({ handleSubmit }) => {
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
                  label='Patient Name, Acc. No., Ref. No., Contact No.'
                />
              )}
            />
          </GridItem>
          <GridItem md={1} />
          <GridItem md={1}>
            <FastField
              name='ageFrom'
              render={(args) => (
                <NumberInput {...args} label='Age From'/>
              )}
            />
          </GridItem>
          <GridItem md={1}>
            <FastField
              name='ageTo'
              render={(args) => (
                <NumberInput {...args} label='Age To'/>
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <Button color='primary' onClick={handleSubmit}>
              Generate Report
            </Button>
          </GridItem>
          <GridItem md={3} />
          {/* 2nd row  */}
          <GridItem md={2}>
            <FastField
              name='dateFrom'
              render={(args) => (
                <DatePicker {...args} label='Visit Date From'/>
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='dateTo'
              render={(args) => (
                <DatePicker {...args} label='Visit Date To'/>
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
                <DoctorProfileSelect {...args} mode='multiple' label='Doctor' />
              )}
            />
          </GridItem>
          <GridItem>
            <FastField
              name='isGroupByDoctor'
              render={(args) => <Checkbox {...args} label='Group By Doctor' />}
            />
          </GridItem>
        </GridContainer>
      </GridContainer>
    </SizeContainer>
  )
}

export default FilterBar
