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
import { DoctorLabel } from '@/components/_medisys'

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
                <NumberInput {...args} label='Age' prefix='From' />
              )}
            />
          </GridItem>
          <GridItem md={1}>
            <FastField
              name='ageTo'
              render={(args) => (
                <NumberInput {...args} label='Age' prefix='To' />
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
                <DatePicker {...args} label='Visit Date' prefix='From' />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='dateTo'
              render={(args) => (
                <DatePicker {...args} label='Visit Date' prefix='To' />
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
          {/* 3rd row  */}
          <GridItem md={2}>
            <FastField
              name='patientTag'
              render={(args) => (
                <Select {...args} label='Patient Tag' options={[]} />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='DoctorIDs'
              render={(args) => (
                <CodeSelect
                  {...args}
                  mode='multiple'
                  code='doctorprofile'
                  label='Doctor'
                  labelField='clinicianProfile.name'
                  renderDropdown={(option) => <DoctorLabel doctor={option} />}
                />
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
