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
import ReportDateRangePicker from '../ReportDateRangePicker'

const FilterBar = ({ handleSubmit, isSubmitting }) => {
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
          <ReportDateRangePicker
            fromDateFieldName='listingFrom'
            toDateFieldName='listingTo'
            limit={{ number: 6, type: 'month' }}
          />

          <GridItem md={2}>
            <FastField
              name='isSeperatePaymentMode'
              render={(args) => (
                <Checkbox {...args} label='Separate Payment Mode' />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Button
              color='primary'
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
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
