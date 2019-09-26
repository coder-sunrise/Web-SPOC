import React, { useEffect, useReducer } from 'react'
import * as Yup from 'yup'
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

const PaymentCollectionColumns = [
  { name: 'patientReferenceNo', title: 'Date' },
  { name: 'patientAccountNo', title: 'Receipt No.' },
  { name: 'patientName', title: 'Ref. No.' },
  { name: 'lastVisitDate', title: 'Payer Name' },
  { name: 'vC_Gender', title: 'Invoice No.' },
  { name: 'vC_AgeInYear', title: 'Inv. Date' },
  { name: 'vC_Nationality', title: 'Amount' },
  { name: 'vC_MobileNo', title: 'Write Off' },
  { name: 'vC_EmailAddress', title: 'Net Amount' },
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

const reportID = 4
const fileName = 'Payment Collection Details'

const PatientListing = ({ values, validateForm }) => {
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
          paymentCollectionData: result.PaymentCollectionDetails.map(
            (item, index) => ({
              ...item,
              id: `paymentCollectionDetails-${index}`,
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
                      columns={PaymentCollectionColumns}
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

const PatientListingWithFormik = withFormik({
  validationSchema: Yup.object().shape(
    {
      // patientCriteria: Yup.string().required(),
    },
  ),
  mapPropsToValues: () => ({
    patientCriteria: '',
  }),
})(PatientListing)

export default PatientListingWithFormik
