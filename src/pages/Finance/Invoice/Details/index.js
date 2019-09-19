import React, { Component } from 'react'
import { connect } from 'dva'
// formik
import { withFormik } from 'formik'
// common components
import { CardContainer } from '@/components'
import InvoiceBanner from './InvoiceBanner'
import InvoiceContent from './Content'

@connect(({ invoiceDetail }) => ({
  invoiceDetail,
}))
@withFormik({
  name: 'invoiceDetail',
  enableReinitialize: true,
  mapPropsToValues: ({ invoiceDetail }) => {
    return invoiceDetail.entity || invoiceDetail.default
  },
})
class InvoiceDetails extends Component {
  componentDidMount () {
    const { dispatch, invoiceDetail } = this.props
    this.props.dispatch({
      //type: 'invoiceDetail/query',
      type: 'invoiceDetail/fakeQueryDone',
      payload: {
        id: invoiceDetail.currentId,
      },
    })
    this.props.dispatch({
      //type: 'invoicePayer/query',
      type: 'invoicePayer/fakeQueryDone',
      payload: {
        id: invoiceDetail.currentId,
      },
    })
  }

  render () {
    const { ...restProps } = this.props
    return (
      <CardContainer hideHeader>
        <InvoiceBanner {...restProps} />
        <InvoiceContent {...restProps} />
      </CardContainer>
    )
  }
}

export default InvoiceDetails
