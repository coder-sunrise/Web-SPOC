import React from 'react'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
import * as Yup from 'yup'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import { Accordion } from '@/components'
import { AccordionTitle } from '@/components/_medisys'
// sub components
import FilterBar from './FilterBar'

import IncomeList from './IncomeList'
import ExpenditureList from './ExpenditureList'
import Summary from './Summary'
import ReportBase from '../ReportBase'

const reportId = 28
const fileName = 'GST Report'

class GSTReport extends ReportBase {
  constructor (props) {
    super(props)
    this.state = {
      ...super.state,
      reportId,
      fileName,
    }
  }

  renderFilterBar = (handleSubmit) => {
    return <FilterBar handleSubmit={handleSubmit} />
  }

  renderContent = (reportDatas) => {
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
            title: <AccordionTitle title='Income' />,
            content: <IncomeList reportDatas={reportDatas} />,
          },
          {
            title: <AccordionTitle title='Expenditure' />,
            content: <ExpenditureList reportDatas={reportDatas} />,
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
const GSTReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    dateFrom: Yup.date().required(),
  }),
  mapPropsToValues: () => ({
    dateFrom: moment(new Date()).startOf('month').toDate(),
    dateTo: moment(new Date()).endOf('month').toDate(),
  }),
})(GSTReport)

export default GSTReportWithFormik
