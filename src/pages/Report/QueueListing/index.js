import React, { useState } from 'react'
// formik
import { withFormik } from 'formik'
// common components
import { CardContainer, GridContainer, GridItem } from '@/components'
// sub components
import FilterBar from './FilterBar'
import { ReportViewer } from '@/components/_medisys'

const QueueListing = ({ handleSubmit, values }) => {
  return (
    <CardContainer hideHeader>
      <GridContainer>
        <GridItem md={12}>
          <FilterBar handleSubmit={handleSubmit} />
        </GridItem>
        <GridItem md={12}>
          <ReportViewer />
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}

const QueueListingWithFormik = withFormik({
  mapPropsToValues: () => ({ listingFrom: undefined, listingTo: undefined }),
})(QueueListing)

export default QueueListingWithFormik
