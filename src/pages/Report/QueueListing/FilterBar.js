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
  VisitTypeSelect,
  Tooltip,
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
              render={args => (
                <Checkbox {...args} label='Separate Payment Mode' />
              )}
            />
          </GridItem>
          <GridItem md={3}></GridItem>
          <GridItem md={2} />
          <GridItem md={2}>
            <FastField
              name='doctorID'
              render={args => <DoctorProfileSelect {...args} />}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='visitTypeIDs'
              render={args => (
                <Tooltip
                  placement='right'
                  title='Select "All" will retrieve active and inactive visit type'
                >
                  <VisitTypeSelect
                    label='Visit Type'
                    {...args}
                    mode='multiple'
                    maxTagPlaceholder='Visit Types'
                    allowClear={true}
                  />
                </Tooltip>
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='asAt'
              render={args => <Checkbox {...args} label='As At' />}
            />
          </GridItem>
          <GridItem md={3}>
            <Button
              color='primary'
              onClick={handleSubmit}
              style={{ position: 'relative', top: -5 }}
              disabled={isSubmitting}
            >
              Generate Report
            </Button>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

export default FilterBar
