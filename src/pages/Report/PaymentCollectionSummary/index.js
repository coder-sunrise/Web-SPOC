import React from 'react'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import { Accordion } from '@/components'
import { AccordionTitle } from '@/components/_medisys'
// sub components
import FilterBar from './FilterBar'
import PaymentCollectionSummaryDetails from './PaymentCollectionSummaryDetails'
import Summary from './Summary'
import SumList from './SumList'
import ReportBase from '../ReportBase'

class PaymentCollectionSummary extends ReportBase {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      reportId: 60,
      fileName: 'Payment Collection Summary Details',
    }
  }

  formatReportParams = (params) => {
    return {
      ...params,
      isPatientPayer:
        params.payerType === 'All' || params.payerType === 'Patient',
      isCompanyPayer:
        params.payerType === 'All' || params.payerType === 'Company',
      groupByDoctor: params.groupBy === 'Doctor',
    }
  }

  renderFilterBar = (handleSubmit, isSubmitting, formikProps) => {
    return (
      <FilterBar
        {...formikProps}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    )
  }

  renderContent = (reportDatas) => {
    return (
      <Accordion
        defaultActive={[
          0,
          1,
          2,
        ]}
        mode='multiple'
        leftIcon
        expandIcon={<SolidExpandMore fontSize='large' />}
        collapses={[
          {
            title: <AccordionTitle title='Payment Collection Details' />,
            content: (
              <PaymentCollectionSummaryDetails reportDatas={reportDatas} />
            ),
          },
          {
            title: <AccordionTitle title='Summary' />,
            content: <Summary reportDatas={reportDatas} />,
          },
          {
            title: <AccordionTitle title='Summary By Payment Mode' />,
            content: <SumList reportDatas={reportDatas} />,
          },
        ]}
      />
    )
  }
}

const PaymentCollectionSummaryWithFormik = withFormik({
  mapPropsToValues: () => ({
    dateFrom: moment(new Date()).startOf('month').toDate(),
    dateTo: moment(new Date()).endOf('month').toDate(),
    payerType: 'All',
    groupBy: 'None',
    isDisplayGST: false,
  }),
})(PaymentCollectionSummary)

export default PaymentCollectionSummaryWithFormik
