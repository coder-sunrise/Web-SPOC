import React from 'react'
// formik
import { FastField } from 'formik'
// common components
import {
  Button,
  CodeSelect,
  DatePicker,
  GridContainer,
  GridItem,
  RadioGroup,
  SizeContainer,
} from '@/components'
// medisys components
import { DoctorProfileSelect } from '@/components/_medisys'
import ReportDateRangePicker from '../ReportDateRangePicker'

const FilterBar = ({ handleSubmit, isSubmitting }) => {
  return (
    <SizeContainer size='sm'>
      <GridContainer>
        <GridContainer alignItems='center'>
          {/* 1st row  */}
          <ReportDateRangePicker />

          <GridItem md={2}>
            <FastField
              name='doctorID'
              render={(args) => <DoctorProfileSelect {...args} />}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='companyIDS'
              render={(args) => (
                <CodeSelect
                  {...args}
                  // code='ctcopayer,ctsupplier'
                  code='ctcopayer'
                  labelField='displayValue'
                  mode='multiple'
                  label='Company'
                />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='paymentModes'
              render={(args) => (
                <CodeSelect
                  {...args}
                  label='Payment Mode'
                  mode='multiple'
                  code='ctpaymentmode'
                  labelField='displayValue'
                  valueField='code'
                />
              )}
            />
          </GridItem>
          <GridItem md={2} />

          <GridItem md={2}>
            <FastField
              name='payerType'
              render={(args) => (
                <RadioGroup
                  {...args}
                  label='Payer Type'
                  options={[
                    {
                      value: 'All',
                      label: 'All',
                    },
                    {
                      value: 'Company',
                      label: 'Company',
                    },
                    {
                      value: 'Patient',
                      label: 'Patient',
                    },
                  ]}
                />
              )}
            />
          </GridItem>

          <GridItem>
            <FastField
              name='groupBy'
              render={(args) => (
                <RadioGroup
                  {...args}
                  label='Group By'
                  defaultValue='3'
                  options={[
                    {
                      value: 'PaymentMode',
                      label: 'Payment Mode',
                    },
                    {
                      value: 'Doctor',
                      label: 'Doctor',
                    },
                    {
                      value: 'None',
                      label: 'None',
                    },
                  ]}
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
