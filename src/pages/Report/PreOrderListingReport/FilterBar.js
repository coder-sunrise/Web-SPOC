import React from 'react'
// formik
import { FastField, Field } from 'formik'
import { status } from '@/utils/codes'
import { formatMessage } from 'umi'

// common components
import {
  Button,
  Checkbox,
  GridContainer,
  GridItem,
  SizeContainer,
  CodeSelect,
  Select,
  TextField,
  Tooltip,
  ClinicianSelect,
  ItemSelect,
} from '@/components'
import ReportDateRangePicker from '../ReportDateRangePicker'

const FilterBar = ({ handleSubmit, isSubmitting }) => {
  return (
    <SizeContainer size='sm'>
      <GridContainer>
        <GridContainer alignItems='flex-end'>
          <GridItem md={3}>
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
          <ReportDateRangePicker
            fromDateLabel='Order Date From'
            toDateLabel='Order Date To'
            fromDateCols='2'
            toDateCols='2'
            fromDateFieldName='orderDateFrom'
            toDateFieldName='orderDateTo'
          />
          <ReportDateRangePicker
            fromDateLabel='Appt Date From'
            toDateLabel='Appt Date To'
            fromDateCols='2'
            toDateCols='2'
            fromDateFieldName='apptDateFrom'
            toDateFieldName='apptDateTo'
          />
        </GridContainer>
        <GridContainer alignItems='flex-end'>
          <GridItem md={2}>
            <Field
              name='itemType'
              render={args => {
                const { form: fm } = args
                return (
                  <Select
                    {...args}
                    label='Type'
                    options={[
                      { name: 'Consumable', value: 'Consumable' },
                      { name: 'Medication', value: 'Medication' },
                      { name: 'Service', value: 'Service' },
                      { name: 'Lab', value: 'Lab' },
                      { name: 'Radiology', value: 'Radiology' },
                      { name: 'Vaccination', value: 'Vaccination' },
                    ]}
                    allowClear={true}
                    onChange={e => {
                      if (e) {
                        fm.setFieldValue('itemListIDs', undefined)
                      }
                    }}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem md={2}>
            <Field
              name='itemListIDs'
              render={args => {
                const { form } = args
                return (
                  <Tooltip
                    placement='right'
                    title='Select "All" will retrieve active and inactive items'
                  >
                    <ItemSelect {...args} itemType={form.values.itemType} />
                  </Tooltip>
                )
              }}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='orderByIDs'
              render={args => (
                <Tooltip
                  placement='right'
                  title='Select "All" will retrieve active and inactive radiographers'
                >
                  <ClinicianSelect
                    label='Order By'
                    noDefaultValue
                    mode='multiple'
                    temp={false}
                    maxTagPlaceholder='Order By'
                    {...args}
                  />
                </Tooltip>
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='status'
              render={args => (
                <Select
                  {...args}
                  label='Status'
                  options={[
                    {
                      name: 'All',
                      value: 'All',
                    },
                    {
                      name: 'New',
                      value: 'New',
                    },
                    {
                      name: 'Actualizing',
                      value: 'Actualizing',
                    },
                    {
                      name: 'Actualized',
                      value: 'Actualized',
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
