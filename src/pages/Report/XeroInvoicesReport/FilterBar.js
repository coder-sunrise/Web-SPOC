import React from 'react'
// common components
import {
  Button,
  GridContainer,
  GridItem,
  SizeContainer,
} from '@/components'
import ReportDateRangePicker from '../ReportDateRangePicker'

const FilterBar = ({ handleSubmit, isSubmitting, exportCSV }) => {
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
          <ReportDateRangePicker />

          {/* <GridItem md={2}>
            <Button
              color='primary'
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Generate Report
            </Button>
          </GridItem> */}

          <GridItem md={2}>
            <Button
              color='primary'
              onClick={exportCSV}
              disabled={isSubmitting}
            >
              Export CSV
            </Button>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

export default FilterBar
