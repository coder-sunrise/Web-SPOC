import React from 'react'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
import { connect } from 'dva'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import { Accordion, GridContainer, GridItem } from '@/components'
import { AccordionTitle } from '@/components/_medisys'
// sub components
import FilterBar from './FilterBar'
import ReferralSourceList from './ReferralSourceList'
import SumList from './SumList'
import ReportBase from '../ReportBase'

@connect(({ settingReferralSource, settingReferralPerson }) => ({
  settingReferralSource, settingReferralPerson,
}))

class ReferralSource extends ReportBase { 

  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      reportId: 72,
      fileName: 'Referral Source Report', 
      referralData: [],
      referralList: [],
      referralPersonData: [],
      referralPersonList: [],
    }
  }

  componentDidMount = () => {
    this.loadReferralSource()
    this.loadReferralPerson()
  }

  onReferralByChange = (value) => {
    let { values, setFieldValue } = this.props
    let { referralPersonData } = this.state
    if (value) {
      referralPersonData = referralPersonData.filter((m) => m.referralSourceIds.indexOf(value) > -1,)
    }
    if (referralPersonData.findIndex(t => t.id === values.referralPersonFK) < 0) {
      setFieldValue('referralPersonFK', null)
    }
    const result = referralPersonData.map((m) => {
      return { name: m.name, value: m.id }
    })
    this.setState({ referralPersonList: result })
  }

  onReferralPersonChange = (value) => {
    let { referralData } = this.state
    let { values, setFieldValue } = this.props
    if (value) {
      const referralPerson = this.state.referralPersonData.find(t => t.id === value)
      referralData = referralPerson.referralSourceIds.map((m) => {
        return this.state.referralData.find(t => t.id === m)
      })
    }
    if (referralData.findIndex(t => t.id === values.referralSourceFK) < 0) {
      setFieldValue('referralSourceFK', null)
    }
    const result = referralData.map((m) => {
      return { name: m.name, value: m.id }
    })
    this.setState({ referralList: result })
  }

  loadReferralSource = () => {
    this.props
      .dispatch({
        type: 'settingReferralSource/query',
      })
      .then((response) => {
        if (response) {
          let data = response.data.filter(t => t.isActive)
          let result = data.map((m) => {
            return { name: m.name, value: m.id }
          })
          this.setState({ referralData: data, referralList: result })
        }
      })
  }

  loadReferralPerson = () => {
    this.props.dispatch({
      type: 'settingReferralPerson/query',
    })
      .then((response) => {
        if (response) {
          let data = response.data.filter(t => t.isActive)
          let result = data.map((m) => {
            return { name: m.name, value: m.id }
          })
          this.setState({ referralPersonData: data, referralPersonList: result })
        }
      })
  }

  formatReportParams = (params) => {
    return {
      ...params,
    }
  }

  renderFilterBar = (handleSubmit, isSubmitting) => {
    return <FilterBar handleSubmit={handleSubmit}
      referralList={this.state.referralList}
      referralPerson={this.state.referralPersonList}
      onReferralByChange={this.onReferralByChange}
      onReferralPersonChange={this.onReferralPersonChange}
      isSubmitting={isSubmitting}
    />
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
            title: <AccordionTitle title='Referral Details' />,
            content: <ReferralSourceList reportDatas={reportDatas} />,
          },
          {
            title: <AccordionTitle title='Summary' />,
            content: <SumList reportDatas={reportDatas} />,
          },
        ]}
      />
    )
  }
}

const ReferralSourceWithFormik = withFormik({
  validationSchema: {},
  mapPropsToValues: () => ({
    dateFrom: moment(new Date()).startOf('month').toDate(),
    dateTo: moment(new Date()).endOf('month').toDate(), 
  }),
})(ReferralSource)

export default ReferralSourceWithFormik
