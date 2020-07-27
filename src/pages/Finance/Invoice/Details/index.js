import React, { Component } from 'react'
import { connect } from 'dva'
// formik
import { withFormik } from 'formik'
// common components
import { LoadingWrapper } from '@/components/_medisys'
// utils
import Authorized from '@/utils/Authorized'
import { INVOICE_VIEW_MODE } from '@/utils/constants'
// sub components
import InvoiceBanner from './InvoiceBanner'
import InvoiceContent from './Content'

@connect(({ invoiceDetail, invoicePayment, loading, clinicSettings }) => ({
  invoiceDetail,
  invoicePayment,
  loading: loading.models.invoiceDetail || loading.models.invoicePayment,
  clinicSettings: clinicSettings.settings || clinicSettings.default,
}))
@withFormik({
  name: 'invoiceDetail',
  enableReinitialize: true,
  mapPropsToValues: ({ invoiceDetail }) => {
    const values = invoiceDetail.entity || invoiceDetail.default

    return {
      ...values,
      totalPayment: values.invoiceTotalAftGST - values.outstandingBalance,
    }
  },
})
class InvoiceDetails extends Component {
  componentWillMount () {
    this.refresh()
  }

  componentWillUnmount () {
    this.props.dispatch({
      type: 'invoiceDetail/updateState',
      payload: {
        mode: INVOICE_VIEW_MODE.DEFAULT,
      },
    })
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
    const {
      values,
      dispatch,
      invoiceDetail,
      invoicePayment,
      loading,
      clinicSettings,
    } = this.props
    const invoiceContentProps = {
      dispatch,
      values,
      invoiceDetail,
      invoicePayment,
      clinicSettings,
    }
    const bannerProps = {
      values,
    }

    return (
      <LoadingWrapper loading={loading} text='Getting invoice details...'>
        <Authorized authority='finance/invoicepayment'>
          <InvoiceBanner {...bannerProps} />
          <InvoiceContent {...invoiceContentProps} />
        </Authorized>
      </LoadingWrapper>
    )
  }
}

export default InvoiceDetails
