import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import { Accordion } from '@/components'
// sub components
import FilterBar from './FilterBar'
import PastPaymentsCollection from './PastPaymentsCollection'
import ReportBase from '../ReportBase'
import VisitListing from './VisitListing'
import PatientDeposit from './PatientDeposit'
import Summary from './Summary'
import { AccordionTitle } from '@/components/_medisys'

class QueueListing extends ReportBase {
  constructor (props) {
    super(props)
    this.state = {
      ...super.state,
      reportId: 1,
      fileName: 'Queue Listing Report',
    }
  }

  renderFilterBar = (handleSubmit, isSubmitting) => {
    return <FilterBar handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
  }

  renderContent = (reportDatas) => {
    if (!reportDatas) return null
    return (
      <Accordion
        // active={this.state.activePanel}
        // onChange={this.handleActivePanelChange}
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
            title: <AccordionTitle title='Visit Listing' />,
            content: <VisitListing reportDatas={reportDatas} />,
          },
          {
            title: <AccordionTitle title='Past Payments Collection' />,
            content: <PastPaymentsCollection reportDatas={reportDatas} />,
          },
          {
            title: <AccordionTitle title='Patient Deposit' />,
            content: <PatientDeposit DepositDatas={reportDatas.PatientDeposit} />,
          },
          {
            title: <AccordionTitle title='Patient Refund' />,
            content: <PatientDeposit DepositDatas={reportDatas.PatientRefund} />,
          },
          {
            title: <AccordionTitle title='Summary' />,
            content: <Summary reportDatas={reportDatas} />,
          },
        ]}
      />
    )
  }
}

const QueueListingWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    listingFrom: Yup.date().required(),
  }),
  mapPropsToValues: () => ({
    listingFrom: moment(new Date()).toDate(),
    listingTo: moment(new Date()).toDate(),
  }),
})(QueueListing)

export default QueueListingWithFormik
