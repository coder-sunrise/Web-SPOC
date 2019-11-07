import React, { Component } from 'react'
import { connect } from 'dva'
// formik
import { withFormik } from 'formik'
// common components
import { CardContainer } from '@/components'
import InvoiceBanner from './InvoiceBanner'
import InvoiceContent from './Content'

@connect(({ invoiceDetail, invoicePayment, clinicSettings }) => ({
  invoiceDetail,
  invoicePayment,
  clinicSettings,
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
    this.refresh()
  }

  refresh = () => {
    const { dispatch, invoiceDetail } = this.props
    dispatch({
      type: 'invoiceDetail/query',
      payload: {
        id: invoiceDetail.currentId,
      },
    })
    dispatch({
      type: 'invoicePayment/query',
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
