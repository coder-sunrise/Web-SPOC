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

@connect(({ invoiceDetail, invoicePayment, patient, loading, clinicSettings }) => ({
  invoiceDetail,
  invoicePayment,
  patient,
  loading: loading.models.invoiceDetail || loading.models.invoicePayment,
  clinicSettings,
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
        entity: null,
      },
    })
    this.props.dispatch({
      type: 'patient/updateState',
      payload: {
        entity: null,
      },
    })
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctcopayer',
      },
    })
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'copaymentscheme',
      },
    })
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctschemetype',
      },
    })
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctservice',
      },
    }) 
  }

  refresh = () => {
    const { dispatch, invoiceDetail, refreshInvoiceList } = this.props

    if (refreshInvoiceList) {
      refreshInvoiceList()
    }

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
    if (invoiceDetail.entity) {
      dispatch({
        type: 'patient/query',
        payload: {
          id: invoiceDetail.entity.patientProfileFK,
        },
      })
    }
  }

  render () {
    const {
      values,
      dispatch,
      invoiceDetail,
      invoicePayment,
      loading,
      patient,
      history,
      clinicSettings,
    } = this.props
    const invoiceContentProps = {
      dispatch,
      values,
      invoiceDetail,
      invoicePayment,
      patient,
      history,
      clinicSettings,
    }
    const bannerProps = {
      values,
      patient,
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
