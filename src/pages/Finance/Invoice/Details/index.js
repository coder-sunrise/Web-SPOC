import React, { Component } from 'react'
// formik
import { withFormik } from 'formik'
// common components
import { CardContainer } from '@/components'
import InvoiceBanner from './InvoiceBanner'
import InvoiceContent from './Content'

@withFormik({ mapPropsToValues: () => ({}) })
class InvoiceDetails extends Component {
  render () {
    return (
      <CardContainer hideHeader>
        <InvoiceBanner />
        <InvoiceContent />
      </CardContainer>
    )
  }
}

export default InvoiceDetails
