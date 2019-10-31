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

const FilterBar = ({ handleSubmit }) => {
  return (
    <SizeContainer size='sm'>
      <GridContainer>
        <GridContainer alignItems='center'>
          {/* 1st row  */}
          <GridItem md={2}>
            <FastField
              name='listingFrom'
              render={(args) => <DatePicker {...args} label='From' />}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='listingTo'
              render={(args) => <DatePicker {...args} label='To' />}
            />
          </GridItem>
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
                  label='Company'
                />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='paymentMode'
              render={(args) => (
                <CodeSelect
                  {...args}
                  code='ctpaymentmode'
                  label='Payment Mode'
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
                      value: '1',
                      label: 'All',
                    },
                    {
                      value: '2',
                      label: 'Company',
                    },
                    {
                      value: '3',
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
                  options={[
                    {
                      value: '1',
                      label: 'Payment Mode',
                    },
                    {
                      value: '2',
                      label: 'Doctor',
                    },
                    {
                      value: '3',
                      label: 'None',
                    },
                  ]}
                />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <Button color='primary' onClick={handleSubmit}>
              Generate Report
            </Button>
          </GridItem>
        </GridContainer>
      </GridContainer>
    </SizeContainer>
  )
}

export default FilterBar
