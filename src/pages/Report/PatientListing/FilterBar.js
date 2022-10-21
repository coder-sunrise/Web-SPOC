import React from 'react'
// formik
import { FastField } from 'formik'
import { formatMessage } from 'umi'
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
  Select,
  VisitTypeSelect,
} from '@/components'
// medisys components
import { DoctorProfileSelect } from '@/components/_medisys'
import ReportDateRangePicker from '../ReportDateRangePicker'
import { useTheme } from '@material-ui/styles'

const FilterBar = ({ handleSubmit, values, isSubmitting }) => {
  const theme = useTheme()
  return (
    <SizeContainer size='sm'>
      <GridContainer>
        <GridContainer alignItems='flex-end'>
          {/* 1st row  */}
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
          <GridItem md={1} style={{ marginLeft: theme.spacing(5) }}>
            <FastField
              name='ageFrom'
              render={args => (
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
              render={args => (
                <NumberInput {...args} label='Age To' max={200} precision={0} />
              )}
            />
          </GridItem>
          <GridItem md={3} />
          {/* 2nd row  */}
          <ReportDateRangePicker
            fromDateLabel='Visit Date From'
            toDateLabel='Visit Date To'
          />

          <GridItem md={1}>
            <FastField
              name='isAllDate'
              render={args => <Checkbox {...args} label='All Date' />}
            />
          </GridItem>

          <GridItem md={2} style={{ marginLeft: theme.spacing(5) }}>
            <FastField
              name='noVisitDateFrom'
              render={args => <DatePicker {...args} label='No Visit Since' />}
            />
          </GridItem>
          <GridItem md={4} />
          <GridItem md={2}>
            <FastField
              name='visitTypeIDs'
              render={args => (
                <VisitTypeSelect
                  label='Visit Type'
                  {...args}
                  mode='multiple'
                  maxTagPlaceholder='Visit Types'
                  allowClear={true}
                />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='doctorIDs'
              render={args => (
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
          <div style={{ marginLeft: theme.spacing(1) }}>
            <FastField
              name='isGroupByDoctor'
              render={args => (
                <Checkbox {...args} label='Group By Optometrist' />
              )}
            />
          </div>
          <GridItem md={2}>
            <FastField
              name='patientStatus'
              render={args => (
                <Select
                  {...args}
                  label='Status'
                  options={[
                    {
                      name: 'All',
                      value: 'all',
                    },
                    {
                      name: 'Active',
                      value: 'active',
                    },
                    {
                      name: 'Inactive',
                      value: 'inactive',
                    },
                  ]}
                  allowClear={false}
                  labelField='name'
                  valueField='value'
                />
              )}
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
