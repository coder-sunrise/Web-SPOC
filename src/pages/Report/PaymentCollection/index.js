import React, { useEffect, useReducer } from 'react'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import { Accordion, CardContainer, GridContainer, GridItem } from '@/components'
import { AccordionTitle } from '@/components/_medisys'
// sub components
import FilterBar from './FilterBar'
import ReportLayoutWrapper from '../ReportLayout'
// services
import { getRawData } from '@/services/report'
import PaymentCollectionList from './PaymentCollectionList'
import Summary from './Summary'
import SumList from './SumList'

const initialState = {
  loaded: false,
  isLoading: false,
  activePanel: -1,
  paymentCollectionData: [],
  params: {},
}
const reducer = (state, action) => {
  switch (action.type) {
    case 'toggleLoading':
      return { ...state, isLoading: !state.isLoading }
    case 'setActivePanel':
      return { ...state, activePanel: action.payload }
    case 'setLoaded':
      return { ...state, loaded: action.payload }
    case 'updateState': {
      return { ...state, ...action.payload }
    }
    case 'reset':
      return { ...initialState }
    default:
      throw new Error()
  }
}

const reportID = 4
const fileName = 'Payment Collection Details'

const PaymentCollection = ({ values, validateForm }) => {
  const [
    state,
    dispatch,
  ] = useReducer(reducer, initialState)
  const handleActivePanelChange = (event, panel) =>
    dispatch({
      type: 'setActivePanel',
      payload: state.activePanel === panel.key ? -1 : panel.key,
    })
  const asyncGetData = async () => {
    dispatch({
      type: 'toggleLoading',
    })
    const params = {
      ...values,
      isPatientPayer: (values.payerType === 'All' || values.payerType === 'Patient'),
      isCompanyPayer: (values.payerType === 'All' || values.payerType === 'Company'),
      groupByPaymentMode: values.groupBy === 'PaymentMode',
      groupByDoctor: values.groupBy === 'Doctor',
    }
    const reportDatas = await getRawData(reportID, params)

    if (reportDatas) {
      dispatch({
        type: 'updateState',
        payload: {
          activePanel: 0,
          loaded: true,
          isLoading: false,
          reportDatas,
          params,
        },
      })
    } else {
      dispatch({
        type: 'updateState',
        payload: {
          loaded: false,
          isLoading: false,
        },
      })
    }
  }
  const onSubmitClick = async () => {
    dispatch({
      type: 'setLoaded',
      payload: false,
    })
    const errors = await validateForm()
    if (Object.keys(errors).length > 0) return
    asyncGetData()
  }

  useEffect(() => {
    /*
    clean up function
    set data to empty array when leaving the page
    */
    return () =>
      dispatch({
        type: 'reset',
      })
  }, [])

  return (
    <CardContainer hideHeader>
      <GridContainer>
        <GridItem md={12}>
          <FilterBar handleSubmit={onSubmitClick} />
        </GridItem>
        <GridItem md={12}>
          <ReportLayoutWrapper
            loading={state.isLoading}
            reportID={reportID}
            reportParameters={state.params}
            loaded={state.loaded}
            fileName={fileName}
          >
            <Accordion
              active={state.activePanel}
              onChange={handleActivePanelChange}
              leftIcon
              expandIcon={<SolidExpandMore fontSize='large' />}
              collapses={[
                {
                  title: <AccordionTitle title='Payment Collection Details' />,
                  content: (
                    <PaymentCollectionList {...state} />
                  ),
                },
                {
                  title: <AccordionTitle title='Summary' />,
                  content: (
                    <Summary {...state} />
                  ),
                },
                {
                  title: <AccordionTitle title='Summary By Payment Model' />,
                  content: (
                    <SumList {...state} />
                  ),
                },
              ]}
            />
          </ReportLayoutWrapper>
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
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
