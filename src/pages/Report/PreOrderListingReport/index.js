import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// dva
import { connect } from 'dva'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import { Accordion } from '@/components'
import { AccordionTitle } from '@/components/_medisys'
// sub components
import FilterBar from './FilterBar'
import PreOrderList from './PreOrderList'
import ReportBase from '../ReportBase'
import Summary from './Summary'
const reportId = 86
const fileName = 'Pre Order Listing Report'

class PreOrderListingReport extends ReportBase {
  constructor(props) {
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

  renderContent = reportDatas => {
    return (
      <Accordion
        defaultActive={[0, 1]}
        mode='multiple'
        leftIcon
        expandIcon={<SolidExpandMore fontSize='large' />}
        collapses={[
          {
            title: <AccordionTitle title='Pre-Order Listing Details' />,
            content: <PreOrderList reportDatas={reportDatas} />,
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

const PreOrderListingReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({}),
  mapPropsToValues: () => ({
    patientCriteria: '',
    apptDateFrom: moment(new Date()).toDate(),
    apptDateTo: moment(new Date())
      .add('1', 'M')
      .toDate(),
    status: [-99, 'New', 'Actualizing', 'Actualized'],
  }),
})(PreOrderListingReport)

export default PreOrderListingReportWithFormik
