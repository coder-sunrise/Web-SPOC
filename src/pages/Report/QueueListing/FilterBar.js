import React from 'react'
// formik
import { FastField } from 'formik'
// common components
import {
  Button,
  Checkbox,
  DatePicker,
  GridContainer,
  GridItem,
  SizeContainer,
} from '@/components'
// medisys components
import { DoctorProfileSelect } from '@/components/_medisys'

const FilterBar = ({ handleSubmit }) => {
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
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
              name='isSeperatePaymentMode'
              render={(args) => (
                <Checkbox {...args} label='Separate Payment Mode' />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Button color='primary' onClick={handleSubmit}>
              Generate Report
            </Button>
          </GridItem>
          <GridItem md={3} />
          <GridItem md={4}>
            <FastField
              name='doctorID'
              render={(args) => <DoctorProfileSelect {...args} />}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='asAt'
              render={(args) => <Checkbox {...args} label='As At' />}
            />
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

export default FilterBar
