import React, { useEffect, useReducer } from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import { Accordion, CardContainer, GridContainer, GridItem } from '@/components'
// sub components
import FilterBar from './FilterBar'
import ReportLayoutWrapper from '../ReportLayout'
import { ReportDataGrid, AccordionTitle } from '@/components/_medisys'
// services
import { getRawData } from '@/services/report'

const SalesSummaryDetailsColumns = [
  { name: 'doctorName', title: 'Doctor Name' },
  { name: 'salesDate', title: 'Sales Date' },
  { name: 'amount', title: 'Amount' },
  { name: 'category', title: 'Category' },
  { name: 'visitNum', title: 'Visit No.' },
]

const SalesSummaryByDateColumns = [
  { name: 'salesDate', title: 'Sales Date' },
  { name: 'totalAmount', title: 'Total Amount' },
]

const CommonColumns = [
  { name: 'categoryCode', title: 'Code' },
  { name: 'categoryDisplayValue', title: 'Display Value' },
  { name: 'totalAmount', title: 'Total Amount' },
]

const initialState = {
  loaded: false,
  isLoading: false,
  activePanel: -1,
  paymentCollectionData: [],
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

const reportID = 3
const fileName = 'Sales Summary'

const SalesSummary = ({ values, validateForm }) => {
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
    const result = await getRawData(reportID, values)

    if (result) {
      dispatch({
        type: 'updateState',
        payload: {
          activePanel: 0,
          loaded: true,
          isLoading: false,
          paymentCollectionData: result.SalesSummaryDetails.map(
            (item, index) => ({
              ...item,
              id: `salesSummary-${index}`,
            }),
          ),
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
            reportParameters={values}
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
                  title: <AccordionTitle title='Patient Listing Summary' />,
                  content: (
                    <ReportDataGrid
                      height={500}
                      data={state.paymentCollectionData}
                      columns={SalesSummaryDetailsColumns}
                    />
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

const SalesSummaryWithFormik = withFormik({
  validationSchema: Yup.object().shape(
    {
      // patientCriteria: Yup.string().required(),
    },
  ),
  mapPropsToValues: () => ({
    dateFrom: moment.toUTC().startOf('month').toDate(),
  }),
})(SalesSummary)

export default SalesSummaryWithFormik
