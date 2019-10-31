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

const VisitListingColumns = [
  { name: 'invoiceID', title: 'Invoice ID' },
  { name: 'sessionNo', title: 'Session No.' },
  { name: 'queueNo', title: 'Queue No.' },
  { name: 'visitReferenceNo', title: 'Visit Reference No.' },
  { name: 'invoiceNo', title: 'Invoice No' },
  { name: 'patientName', title: 'Patient Name' },
  { name: 'visitDate', title: 'Visit Date' },
  { name: 'timeIn', title: 'Time In' },
  { name: 'timeout', title: 'Time Out' },
  { name: 'doctorCode', title: 'Doctor MCR No.' },
  { name: 'invoiceAmt', title: 'Invoice Amt.' },
  { name: 'gstAmt', title: 'GST Amt.' },
  { name: 'patientPayable', title: 'Patient Payable' },
  { name: 'totalPatientPaid', title: 'Total Patient Paid' },
  { name: 'patientPaid', title: 'Patient Paid' },
  { name: 'coPayerPayable', title: 'Copayer Payable' },
  { name: 'totalBalanceTrasfer', title: 'Total Balance Transfer' },
  { name: 'paymentMode', title: 'Payment Mode' },
  { name: 'countNumber', title: 'Count Number' },
  { name: 'coPayerName', title: 'Copayer Name' },
]

const PastPaymentCollectionTableColumn = [
  // { name: 'invoicePayerDetail', title: 'Invoice Payer Detail' },
  { name: 'payerName', title: 'Payer Name' },
  { name: 'doctorCode', title: 'Doctor' },
  { name: 'invoiceNo', title: 'Invoice No' },
  { name: 'invoiceDate', title: 'Invoice Date' },
  { name: 'mode', title: 'Payment Mode' },
  { name: 'invoiceAmt', title: 'Invoice Amt' },
  { name: 'coPayerPayable', title: 'Copayer Payable' },
]

const PastPaymentCollectionTableColumnExtension = [
  { columnName: 'invoiceDate', type: 'date' },
]

const fileName = 'Queue Listing Report'

const initialState = {
  loaded: false,
  isLoading: false,
  activePanel: -1,
  visitListingData: [],
  pastPaymentsCollection: [],
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

const QueueListing = ({ values, validateForm }) => {
  const [
    state,
    dispatch,
  ] = useReducer(reducer, initialState)

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

  const handleActivePanelChange = (event, panel) =>
    dispatch({
      type: 'setActivePanel',
      payload: state.activePanel === panel.key ? -1 : panel.key,
    })

  const asyncGetData = async () => {
    dispatch({
      type: 'toggleLoading',
    })
    const queueListingResult = await getRawData(1, values)

    if (queueListingResult) {
      const visitListingData = queueListingResult.VisitListingDetails.map(
        (item, index) => ({
          ...item,
          id: `qListing-${index}-${item.visitReferenceNo}`,
        }),
      )
      const pastPaymentsCollection = queueListingResult.PastInvoicePaymentDetails.map(
        (item, index) => ({
          ...item,
          id: `qListing-${index}-${item.invoiceNo}`,
        }),
      )

      dispatch({
        type: 'updateState',
        payload: {
          activePanel: 0,
          loaded: true,
          isLoading: false,
          visitListingData,
          pastPaymentsCollection,
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

  return (
    <CardContainer hideHeader>
      <GridContainer>
        <GridItem md={12}>
          <FilterBar handleSubmit={onSubmitClick} />
        </GridItem>
        <GridItem md={12}>
          <ReportLayoutWrapper
            loading={state.isLoading}
            reportID={1}
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
                  title: <AccordionTitle title='Visit Listing' />,
                  content: (
                    <ReportDataGrid
                      height={500}
                      data={state.visitListingData}
                      columns={VisitListingColumns}
                    />
                  ),
                },
                {
                  title: <AccordionTitle title='Past Payments Collection' />,
                  content: (
                    <ReportDataGrid
                      data={state.pastPaymentsCollection}
                      columns={PastPaymentCollectionTableColumn}
                      columnExtensions={
                        PastPaymentCollectionTableColumnExtension
                      }
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

const QueueListingWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    listingFrom: Yup.date().required(),
  }),
  mapPropsToValues: () => ({
    listingFrom: moment().startOf('month').format('YYYY-MM-DD hh:mm'),
    listingTo: moment().endOf('month').format('YYYY-MM-DD hh:mm'),
  }),
})(QueueListing)

export default QueueListingWithFormik
