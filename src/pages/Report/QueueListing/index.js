import React, { useEffect, setState, useReducer } from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import {
  Accordion,
  CardContainer,
  DateFormatter,
  GridContainer,
  GridItem,
} from '@/components'
// sub components
import FilterBar from './FilterBar'
import ReportLayoutWrapper from '../ReportLayout'
import { ReportDataGrid, AccordionTitle } from '@/components/_medisys'
// services
import { getRawData } from '@/services/report'

const VisitListingColumns = [
  // { name: 'invoiceID', title: 'Invoice ID' },
  // { name: 'sessionNo', title: 'Session No.' },
  { name: 'queueNo', title: 'Queue No.' },
  { name: 'patientName', title: 'Patient Name' },
  { name: 'doctorCode', title: 'Doctor MCR No.' },
  { name: 'timeIn', title: 'Time In' },
  { name: 'timeout', title: 'Time Out' },
  { name: 'invoiceNo', title: 'Invoice No' },
  { name: 'invoiceAmt', title: 'Invoice Amt.' },
  { name: 'gstAmt', title: 'GST' },
  { name: 'totalPatientPaid', title: 'Patient Paid Amt.' },
  { name: 'paymentMode', title: 'Mode' },
  { name: 'patientPayable', title: 'Patient O/S Amt.' },
  { name: 'coPayerPayable', title: 'Company Payable' },
  { name: 'coPayerName', title: 'Co-Payer' },
  { name: 'visitDate', title: 'Visit Date' },

  // { name: 'visitReferenceNo', title: 'Visit Reference No.' },
  // { name: 'patientPaid', title: 'Patient Paid' },
  // { name: 'totalBalanceTrasfer', title: 'Total Balance Transfer' },
  // { name: 'countNumber', title: 'Count Number' },
]

const VisitListingColumnExtension = [
  { columnName: 'patientName', width: 180 },
  { columnName: 'invoiceAmt', type: 'currency', currency: true },
  { columnName: 'gstAmt', type: 'currency', currency: true },
  { columnName: 'totalPatientPaid', type: 'currency', currency: true },
  { columnName: 'patientPayable', type: 'currency', currency: true },
  { columnName: 'coPayerPayable', type: 'currency', currency: true },
  {
    columnName: 'timeIn',
    width: 160,
    render: (row) =>
      DateFormatter({
        value: row.timeIn,
        full: true,
      }),
  },
  {
    columnName: 'timeout',
    width: 160,
    render: (row) =>
      DateFormatter({
        value: row.timeout,
        full: true,
      }),
  },
]

const GroupCellContent = ({ row }) => (
  <span style={{ paddingRight: 8 }}>
    {DateFormatter({
      value: row.value,
      full: false,
    })}
  </span>
)

const PastPaymentCollectionTableColumn = [
  // { name: 'invoicePayerDetail', title: 'Invoice Payer Detail' },
  { name: 'payerName', title: 'Payer Name' },
  { name: 'doctorCode', title: 'Doctor' },
  { name: 'invoiceNo', title: 'Invoice No' },
  { name: 'invoiceDate', title: 'Invoice Date' },
  { name: 'mode', title: 'Payment Mode' },
  { name: 'invoiceAmt', title: 'Invoice Amt' },
  { name: 'paymentReceivedDate', title: 'Payment Received Date' },
]

const PastPaymentCollectionTableColumnExtension = [
  { columnName: 'invoiceDate', type: 'date' },
  { columnName: 'invoiceAmt', type: 'currency', currency: true },
]

const InvoicePayerTableColumn = [
  { name: 'coPayer', title: 'Co-Payer' },
  { name: 'coPayerPayable', title: 'Co-Payer Payable' },
]

const InvoicePayerTableColumnExtension = [
  { columnName: 'coPayerPayable', type: 'currency', currency: true },
]

const fileName = 'Queue Listing Report'

const initialState = {
  loaded: false,
  isLoading: false,
  activePanel: -1,
  invoicePayerListingData: [],
  visitListingData: [],
  visitListingExpandedGroups: [],
  pastPaymentsCollection: [],
  paymentCollectionExpandedGroups: [],
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

const getGroupingID = ({ groupingField, data }) => {
  const _result = data.reduce((grouped, row) => {
    if (!grouped.includes(row[groupingField]))
      return [
        ...grouped,
        row[groupingField],
      ]

    return [
      ...grouped,
    ]
  }, [])
  return _result
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

      const invoicePayerListingData = queueListingResult.InvoicePayerDetail.map(
        (item, index) => ({ ...item, id: `${item.coPayer}-${index}` }),
      )

      dispatch({
        type: 'updateState',
        payload: {
          activePanel: 0,
          loaded: true,
          isLoading: false,
          invoicePayerListingData,
          visitListingData,
          visitListingExpandedGroups: getGroupingID({
            groupingField: 'visitDate',
            data: visitListingData,
          }),
          paymentCollectionExpandedGroups: getGroupingID({
            groupingField: 'paymentReceivedDate',
            data: pastPaymentsCollection,
          }),
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

  const handleVisitListingExpandedGroupsChange = (expandedGroups) => {
    dispatch({
      type: 'updateState',
      payload: {
        visitListingExpandedGroups: expandedGroups,
      },
    })
  }

  const handlePaymentCollectionsExpandedGroupsChange = (expandedGroups) => {
    dispatch({
      type: 'updateState',
      payload: {
        paymentCollectionExpandedGroups: expandedGroups,
      },
    })
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
                      columnExtensions={VisitListingColumnExtension}
                      FuncProps={{
                        pager: false,
                        grouping: true,
                        groupingConfig: {
                          row: {
                            contentComponent: GroupCellContent,
                          },
                          state: {
                            grouping: [
                              { columnName: 'visitDate' },
                            ],
                            expandedGroups: [
                              ...state.visitListingExpandedGroups,
                            ],
                            onExpandedGroupsChange: handleVisitListingExpandedGroupsChange,
                          },
                        },
                      }}
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
                      FuncProps={{
                        pager: false,
                        grouping: true,
                        groupingConfig: {
                          row: {
                            contentComponent: GroupCellContent,
                          },
                          state: {
                            grouping: [
                              { columnName: 'paymentReceivedDate' },
                            ],
                            expandedGroups: [
                              ...state.paymentCollectionExpandedGroups,
                            ],
                            onExpandedGroupsChange: handlePaymentCollectionsExpandedGroupsChange,
                          },
                        },
                      }}
                    />
                  ),
                },
                {
                  title: <AccordionTitle title='Invoice Payer' />,
                  content: (
                    <ReportDataGrid
                      data={state.invoicePayerListingData}
                      columns={InvoicePayerTableColumn}
                      columnExtensions={InvoicePayerTableColumnExtension}
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
