import React, { useEffect, useReducer } from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import {
  CardContainer,
  DatePicker,
  GridContainer,
  GridItem,
  NumberInput,
  TextField,
} from '@/components'
// sub components
import ReportLayoutWrapper from '../../ReportLayout'
import { ReportDataGrid } from '@/components/_medisys'
// services
import { getRawData } from '@/services/report'

const PaymentDetailsColumns = [
  { name: 'paymentMode', title: 'Payment Mode' },
  { name: 'currentCollected', title: 'This Session' },
  { name: 'pastCollected', title: 'Past Session' },
  { name: 'subTotal', title: 'Sub Total' },
]

const initialState = {
  loaded: false,
  isLoading: false,
  paymentDetailsData: {},
  sessionDetails: {},
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

const reportID = 5
const fileName = 'Session Summary Report'

const SessionSummary = ({ match, sessionID }) => {
  const [
    state,
    dispatch,
  ] = useReducer(reducer, initialState)

  const values = { sessionID: match ? match.params.id : sessionID }

  const asyncGetData = async () => {
    dispatch({
      type: 'toggleLoading',
    })
    const result = await getRawData(reportID, values)

    if (result) {
      const [
        totalCurrentCollected,
        totalPastCollected,
      ] = result.PaymentDetails.reduce(
        (sum, payment) => [
          sum + payment.currentCollected,
          sum + payment.pastCollected,
        ],
        [
          0,
          0,
        ],
      )
      dispatch({
        type: 'updateState',
        payload: {
          activePanel: 0,
          loaded: true,
          isLoading: false,
          sessionDetails: result.SessionDetails[0],
          paymentDetailsData: [
            ...result.PaymentDetails.map((item, index) => ({
              ...item,
              id: `paymentDetails-${index}`,
              subTotal: item.currentCollected + item.pastCollected,
            })),
            {
              paymentMode: 'Total',
              currentCollected: totalCurrentCollected,
              pastCollected: totalPastCollected,
              subTotal: totalCurrentCollected + totalPastCollected,
            },
          ],
        },
      })
    }
  }

  useEffect(() => {
    /* 
    clean up function
    set data to empty array when leaving the page 
    */
    asyncGetData()
    return () =>
      dispatch({
        type: 'reset',
      })
  }, [])

  const { sessionDetails } = state
  console.log({ sessionDetails })
  return (
    <CardContainer hideHeader>
      <GridContainer>
        <GridItem md={12}>
          <ReportLayoutWrapper
            simple
            loading={state.isLoading}
            reportID={reportID}
            reportParameters={values}
            loaded={state.loaded}
            fileName={fileName}
          >
            <GridContainer>
              <GridItem md={3}>
                <TextField
                  label='Session No.'
                  disabled
                  value={sessionDetails.sessionNo}
                />
              </GridItem>
              <GridItem md={3}>
                <NumberInput
                  label='Total Visits'
                  disabled
                  value={sessionDetails.totalVisit}
                />
              </GridItem>

              <GridItem md={3}>
                <DatePicker
                  label='Session Start Date'
                  disabled
                  value={sessionDetails.sessionStartDate}
                />
              </GridItem>
              <GridItem md={3}>
                <DatePicker
                  label='Session Close Date'
                  disabled
                  value={sessionDetails.sessionCloseDate}
                />
              </GridItem>
              <GridItem md={3}>
                <NumberInput
                  label='Total Charges'
                  disabled
                  currency
                  value={sessionDetails.totalSessionCharges}
                />
              </GridItem>
              <GridItem md={3} style={{ marginBottom: 16 }}>
                <NumberInput
                  label='Total O/S Bal.'
                  disabled
                  currency
                  value={sessionDetails.totalSessionOutstandingBalance}
                />
              </GridItem>
              <GridItem md={12} style={{ marginBottom: 8, marginTop: 8 }}>
                <h4>Payment Summary</h4>
              </GridItem>
              <GridItem md={12}>
                <ReportDataGrid
                  height='auto'
                  data={state.paymentDetails}
                  columns={PaymentDetailsColumns}
                />
              </GridItem>
            </GridContainer>
          </ReportLayoutWrapper>
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}

export default SessionSummary
