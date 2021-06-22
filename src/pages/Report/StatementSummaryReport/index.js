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
import { AccordionTitle } from '@/components/_medisys'
import FilterBar from './FilterBar'
import StatementList from './StatementList'
import AgeingList from './AgeingList'
import ReportBase from '../ReportBase'
import StatementInvoiceList from './StatementInvoiceList'

const reportId = 54
const fileName = 'Statement Summary Report'

class StatementSummaryReport extends ReportBase {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      reportId,
      fileName,
    }
  }

  formatReportParams = (params) => {
    return {
      ...params,
    }
  }

  renderFilterBar = (handleSubmit, isSubmitting) => {
    return (
      <FilterBar
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        values={this.props.values}
        setFieldValue={this.props.setFieldValue}
      />
    )
  }

  renderContent = (reportDatas) => {
    if (!reportDatas) return null
    let segments = [
      {
        title: <AccordionTitle title='Statement Summary' />,
        content: <StatementList reportDatas={reportDatas} />,
      },
    ]

    if (reportDatas.ListingDetails[0].isPrintDetails) {
      segments = [
        ...segments,
        {
          title: <AccordionTitle title='Statement Details' />,
          content: <StatementInvoiceList reportDatas={reportDatas} />,
        },
      ]
    }

    if (reportDatas.ListingDetails[0].asAt) {
      segments = [
        ...segments,
        {
          title: <AccordionTitle title='Ageing Report' />,
          content: <AgeingList reportDatas={reportDatas} />,
        },
      ]
    }

    return (
      <Accordion
        defaultActive={[
          0,
          1,
        ]}
        mode='multiple'
        leftIcon
        expandIcon={<SolidExpandMore fontSize='large' />}
        collapses={segments}
      />
    )
  }
}

const StatementSummaryReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    dateFrom: Yup.date().required(),
  }),
  mapPropsToValues: () => ({
    dateFrom: moment(new Date()).startOf('month').toDate(),
    dateTo: moment(new Date()).endOf('month').toDate(),
    dueDateFrom: moment(new Date()).startOf('month').toDate(),
    dueDateTo: moment(new Date()).endOf('month').toDate(),
    isPrintDetails: false,
  }),
})(StatementSummaryReport)

export default StatementSummaryReportWithFormik
