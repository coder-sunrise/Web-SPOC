import React from 'react'
// formik
import { FastField } from 'formik'
import moment from 'moment'
// common components
import {
  Button,
  DateRangePicker,
  GridContainer,
  GridItem,
  SizeContainer,
  TextField,
  Select,
} from '@/components'
import { getBizSession } from '@/services/queue'
import { osBalanceStatus, sessionOptions } from '@/utils/codes'

const FilterBar = ({ classes, dispatch, values }) => {
  const getBizSessionId = async () => {
    const bizSessionPayload = {
      IsClinicSessionClosed: false,
    }
    const result = await getBizSession(bizSessionPayload)
    const { data } = result.data
    if (data.length > 0) {
      return data[0].id
    }
    return null
  }

  return (
    <SizeContainer>
      <React.Fragment>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='invoiceNo'
              render={(args) => <TextField label='Invoice No' {...args} />}
            />
          </GridItem>
          <GridItem xs={6} md={6}>
            <FastField
              name='invoiceDates'
              render={(args) => {
                return (
                  <DateRangePicker
                    label='Invoice Date From'
                    label2='Invoice Date To'
                    allowClear={false}
                    disabledDate={(d) => !d || d.isAfter(moment())}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='outstandingBalanceStatus'
              render={(args) => {
                return (
                  <Select
                    label='O/S Balance'
                    options={osBalanceStatus}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='patientAccountNo'
              render={(args) => (
                <TextField label='Patient Acc. No.' {...args} />
              )}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='patientName'
              render={(args) => <TextField label='Patient Name' {...args} />}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='session'
              render={(args) => (
                <Select label='Session' options={sessionOptions} {...args} />
              )}
            />
          </GridItem>
        </GridContainer>

        <div className={classes.searchButton}>
          <Button
            color='primary'
            onClick={async () => {
              const {
                invoiceNo,
                patientName,
                patientAccountNo,
                invoiceDates,
                outstandingBalanceStatus,
                session,
              } = values
              let SessionID
              if (session === 'current') {
                SessionID = await getBizSessionId()
              }
              dispatch({
                type: 'invoiceList/query',
                payload: {
                  // combineCondition: 'and',
                  lgteql_invoiceDate: invoiceDates
                    ? invoiceDates[0]
                    : undefined,
                  lsteql_invoiceDate: invoiceDates
                    ? invoiceDates[1]
                    : undefined,
                  lgt_OutstandingBalance:
                    outstandingBalanceStatus === 'yes' &&
                    outstandingBalanceStatus !== 'all'
                      ? '0'
                      : undefined,
                  lsteql_OutstandingBalance:
                    outstandingBalanceStatus === 'no' &&
                    outstandingBalanceStatus !== 'all'
                      ? '0'
                      : undefined,
                  apiCriteria: {
                    SessionID,
                  },
                  group: [
                    {
                      invoiceNo,
                      'VisitInvoice.VisitFKNavigation.PatientProfileFkNavigation.Name': patientName,
                      'VisitInvoice.VisitFKNavigation.PatientProfileFkNavigation.PatientAccountNo': patientAccountNo,
                      combineCondition: 'and',
                    },
                  ],
                },
              })
            }}
          >
            Search
          </Button>
          {/* <i>Double click on record to view invoice</i> */}
        </div>
      </React.Fragment>
    </SizeContainer>
  )
}

export default FilterBar
