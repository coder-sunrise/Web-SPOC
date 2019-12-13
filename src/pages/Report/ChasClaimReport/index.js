import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// sub components
import FilterBar from './FilterBar'
import ChasList from './ChasList'
import ChasStatusList from './ChasStatusList'
import ReportBase from '../ReportBase'
// common components
import { Accordion } from '@/components'
import { AccordionTitle } from '@/components/_medisys'

class ChasClaimReport extends ReportBase {
  constructor (props) {
    super(props)
    this.state = {
      ...super.state,
      reportId: 30,
      fileName: 'CHAS Claim Report',
    }
  }

  renderFilterBar = (handleSubmit, isSubmitting) => {
    return <FilterBar handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
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
            title: <AccordionTitle title='Claim Details' />,
            content: <ChasList reportDatas={reportDatas} />,
          },
          {
            title: <AccordionTitle title='Claim Summary' />,
            content: <ChasStatusList reportDatas={reportDatas} />,
          },
        ]}
      />
    )
  }
}

const ChasClaimReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    dateFrom: Yup.date().required(),
  }),
  mapPropsToValues: () => ({
    dateFrom: moment(new Date()).startOf('month').toDate(),
    dateTo: moment(new Date()).endOf('month').toDate(),
  }),
})(ChasClaimReport)

export default ChasClaimReportWithFormik
