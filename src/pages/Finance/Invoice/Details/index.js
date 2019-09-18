import React, { Component } from 'react'
import { connect } from 'dva'
// formik
import { withFormik } from 'formik'
// common components
import { CardContainer } from '@/components'
import InvoiceBanner from './InvoiceBanner'
import InvoiceContent from './Content'

@connect(({ invoiceDetail, invoicePayment }) => ({
  invoiceDetail,
  invoicePayment,
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
    const { invoiceDetail, dispatch } = this.props
    this.props.dispatch({
      type: 'invoiceDetail/fakeQueryDone',
    })
    // this.props.dispatch({
    //   type: 'invoiceDetail/queryOne',
    //   payload: {
    //     id: invoiceDetail.currentId,
    //   },
    // })
  }

  render () {
    const {  ...restProps } = this.props
    return (
      <CardContainer hideHeader>
        <InvoiceBanner {...restProps} />
        <InvoiceContent {...restProps} />
      </CardContainer>
    )
  }
}

export default InvoiceDetails
