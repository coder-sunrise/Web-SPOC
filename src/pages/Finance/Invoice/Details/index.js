import React, { Component } from 'react'
import { connect } from 'dva'
// formik
import { withFormik } from 'formik'
// common components
import { CardContainer } from '@/components'
import { LoadingWrapper } from '@/components/_medisys'
import InvoiceBanner from './InvoiceBanner'
import InvoiceContent from './Content'

@connect(({ invoiceDetail, invoicePayment, loading }) => ({
  invoiceDetail,
  invoicePayment,
  loading: loading.models.invoiceDetail || loading.models.invoicePayment,
}))
@withFormik({
  name: 'invoiceDetail',
  enableReinitialize: true,
  mapPropsToValues: ({ invoiceDetail }) => {
    return invoiceDetail.entity || invoiceDetail.default
  },
})
class InvoiceDetails extends Component {
  componentWillMount () {
    this.refresh()
  }

  componentWillUnmount () {
    // const { dispatch } = this.props
    // dispatch({
    //   type: 'invoiceDetail/reset',
    // })
    // dispatch({
    //   type: 'invoicePayment/reset',
    // })
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
    const { values, invoiceDetail, invoicePayment, loading } = this.props
    const invoiceContentProps = {
      values,
      invoiceDetail,
      invoicePayment,
    }
    const bannerProps = {
      values,
    }
    return (
      <LoadingWrapper loading={loading} text='Getting invoice details...'>
        <CardContainer hideHeader>
          <InvoiceBanner {...bannerProps} />
          <InvoiceContent {...invoiceContentProps} />
        </CardContainer>
      </LoadingWrapper>
    )
  }
}

export default InvoiceDetails
