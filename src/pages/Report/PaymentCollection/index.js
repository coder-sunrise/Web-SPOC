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
import PaymentCollectionList from './PaymentCollectionList'
import Summary from './Summary'
import SumList from './SumList'
import ReportBase from '../ReportBase'

class PaymentCollection extends ReportBase {
  constructor (props) {
    super(props)
    this.state = {
      ...super.state,
      reportId: 4,
      fileName: 'Payment Collection Details',
    }
  }

  formatReportParams = (params) => {
    return {
      ...params,
      isPatientPayer:
        params.payerType === 'All' || params.payerType === 'Patient',
      isCompanyPayer:
        params.payerType === 'All' || params.payerType === 'Company',
      groupByPaymentMode: params.groupBy === 'PaymentMode',
      groupByDoctor: params.groupBy === 'Doctor',
    }
  }

  renderFilterBar = (handleSubmit) => {
    return <FilterBar handleSubmit={handleSubmit} />
  }

  renderContent = (reportDatas) => {
    return <Accordion
      active={this.state.activePanel}
      onChange={this.handleActivePanelChange}
      leftIcon
      expandIcon={<SolidExpandMore fontSize='large' />}
      collapses={[
        {
          title: <AccordionTitle title='Payment Collection Details' />,
          content: <PaymentCollectionList reportDatas={reportDatas} />,
        },
        {
          title: <AccordionTitle title='Summary' />,
          content: <Summary reportDatas={reportDatas} />,
        },
        {
          title: <AccordionTitle title='Summary By Payment Model' />,
          content: <SumList reportDatas={reportDatas} />,
        },
      ]}
    />
  }

}

const PaymentCollectionWithFormik = withFormik({
  mapPropsToValues: () => ({
    dateFrom: moment(new Date()).startOf('month').toDate(),
    dateTo: moment(new Date()).endOf('month').toDate(),
    payerType: 'All',
    groupBy: 'None',
  }),
})(PaymentCollection)

export default PaymentCollectionWithFormik
