import React from 'react'
// formik
import { FastField, Field } from 'formik'
// common components
import {
  Button,
  CodeSelect,
  GridContainer,
  GridItem, Checkbox,
  SizeContainer,
} from '@/components'
import ReportDateRangePicker from '../ReportDateRangePicker'

const FilterBar = ({ handleSubmit, isSubmitting, referralList, onReferralSourceChange, referralPerson }) => {  
  return (
    <SizeContainer size='sm'>
      <GridContainer>
        <GridContainer alignItems='center'>
          <GridItem md={4}>
            <Field name='referralSourceIds'
              render={(args) => (
                <CodeSelect {...args}
                  options={referralList}
                  labelField='name'
                  valueField='value'
                  label='Referral Source'
                  mode='multiple' 
                  onChange={onReferralSourceChange}
                  disableAll
                />
              )}
            />
          </GridItem>
          <GridItem md={8} />
          <GridItem md={4}>
            <Field name='referralPersonIds'
              render={(args) => (
                <CodeSelect {...args}
                  labelField='name'
                  label='Ref. Person Name' 
                  options={referralPerson}
                  valueField='value'
                  mode='multiple'
                  disableAll
                />
              )}
            />
          </GridItem>
          <GridItem md={8} />
          <ReportDateRangePicker
            fromDateLabel='Visit Date From'
            toDateLabel='Visit Date To'
          />
          <GridItem md={1}>
            <FastField
              name='isAllDate'
              render={(args) => <Checkbox {...args} label='All Date' />}
            />
          </GridItem>
          <GridItem md={2} />
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
