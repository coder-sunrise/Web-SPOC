import React from 'react'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
import { connect } from 'dva'
import * as Yup from 'yup'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import { Accordion } from '@/components'
import { AccordionTitle } from '@/components/_medisys'
// sub components
import FilterBar from './FilterBar'

import DetailsList from './DetailsList'
import Summary from './Summary'
import ReportBase from '../ReportBase'

const reportId = 83
const fileName = 'Radiology Statisitic Report'

@connect(({ codetable }) => ({
  codetable,
}))
class RadiologyStatisticReport extends ReportBase {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      reportId,
      fileName,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'codetable/fetchCodes',
      payload: { code: 'cttag', force: true },
    }).then(result => {
      if (result) {
        this.setState({
          ctTag: _.orderBy(
            result
              .filter(t => t.category === 'Patient')
              .map(x => {
                return { id: x.id, name: x.displayValue }
              }),
            ['name'],
          ),
        })
      }
    })

    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctservice',
        force: true,
        filter: {
          'serviceFKNavigation.IsActive': true,
          'serviceCenterFKNavigation.IsActive': true,
          combineCondition: 'and',
          apiCriteria: { ServiceCenterType: 'Radiology' },
        },
      },
    })
  }

  renderFilterBar = (handleSubmit, isSubmitting, props) => {
    return (
      <FilterBar
        cttag={this.state.ctTag}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    )
  }

  renderContent = reportDatas => {
    return (
      <Accordion
        // active={this.state.activePanel}
        // onChange={this.handleActivePanelChange}
        defaultActive={[0, 1]}
        mode='multiple'
        leftIcon
        expandIcon={<SolidExpandMore fontSize='large' />}
        collapses={[
          {
            title: <AccordionTitle title='Radiology Statistic Details' />,
            content: <DetailsList reportDatas={reportDatas} />,
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
const RadiologyStatisticReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    dateFrom: Yup.date().required(),
  }),
  mapPropsToValues: () => ({
    dateFrom: moment(new Date())
      .startOf('month')
      .toDate(),
    dateTo: moment(new Date())
      .endOf('month')
      .toDate(),
  }),
})(RadiologyStatisticReport)

export default RadiologyStatisticReportWithFormik
