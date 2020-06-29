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
    return <FilterBar handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
  }

  renderContent = (reportDatas) => {
    if (!reportDatas) return null
    return (
      <Accordion
        defaultActive={[
          0,
        ]}
        mode='multiple'
        leftIcon
        expandIcon={<SolidExpandMore fontSize='large' />}
        collapses={[
          {
            title: <AccordionTitle title='Statement Summary' />,
            content: <StatementList reportDatas={reportDatas} />,
          },
          {
            title: <AccordionTitle title='Ageing Report' />,
            content: <AgeingList reportDatas={reportDatas} />,
          },
        ]}
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
  }),
})(StatementSummaryReport)

export default StatementSummaryReportWithFormik
