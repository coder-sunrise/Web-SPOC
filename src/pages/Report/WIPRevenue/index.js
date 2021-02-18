import React from 'react'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import { Accordion } from '@/components'
import { AccordionTitle } from '@/components/_medisys'
import ReportBase from '../ReportBase'
import FilterBar from './FilterBar'
import Details from './Details'
import Summary from './Summary'

const reportId = 67
const fileName = 'WIP Revenue Report'
class WIPRevenue extends ReportBase {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      reportId,
      fileName,
    }
  }

  renderFilterBar = (handleSubmit, isSubmitting) => {
    return <FilterBar handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
  }

  renderContent = (reportDatas) => {
    return (
      <Accordion
        defaultActive={[
          0,
          1,
        ]}
        mode='multiple'
        leftIcon
        expandIcon={<SolidExpandMore fontSize='large' />}
        collapses={[
          {
            title: <AccordionTitle title='Details' />,
            content: <Details reportDatas={reportDatas} />,
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
const WIPRevenueWithFormik = withFormik({
  mapPropsToValues: () => ({
    dateFrom: moment(new Date()).startOf('month').toDate(),
    dateTo: moment(new Date()).endOf('month').toDate(),
  }),
})(WIPRevenue)

export default WIPRevenueWithFormik