import React, { useEffect } from 'react'
// formik
import { FastField, Field } from 'formik'
import { FormattedMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'
import moment from 'moment'
// common components
import {
  ProgressButton,
  DateRangePicker,
  GridContainer,
  GridItem,
  SizeContainer,
  TextField,
  Select,
  Checkbox,
} from '@/components'
import { getBizSession } from '@/services/queue'
import { osBalanceStatus, sessionOptions } from '@/utils/codes'

const FilterBar = ({ classes, dispatch, values }) => {
  const unmount = () =>
    dispatch({
      type: 'invoiceList/updateState',
      payload: {
        filter: {},
      },
    })

  useEffect(() => {
    return unmount
  }, [])

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

  const onSearchClick = async () => {
    const {
      invoiceNo,
      patientName,
      patientAccountNo,
      invoiceDates,
      outstandingBalanceStatus,
      session,
    } = values
    let SessionID
    let SessionType
    if (session === 'current') {
      SessionID = await getBizSessionId()
      SessionType = 'CurrentSession'
    } else if (session === 'past') {
      SessionID = await getBizSessionId()
      SessionType = 'PastSession'
    }

    let { isIncludePatientOS, isIncludeGovtOS, isIncludeCorporateOS } = values
    let isHasOutstanding
    if (
      outstandingBalanceStatus === undefined ||
      outstandingBalanceStatus === 'all'
    ) {
      isIncludePatientOS = false
      isIncludeGovtOS = false
      isIncludeCorporateOS = false
      isHasOutstanding = undefined
    } else if (outstandingBalanceStatus === 'yes') {
      isHasOutstanding = true
    } else {
      isHasOutstanding = false
    }
    dispatch({
      type: 'invoiceList/query',
      payload: {
        // keepFilter: false,
        // combineCondition: 'and',
        lgteql_invoiceDate: invoiceDates ? invoiceDates[0] : undefined,
        lsteql_invoiceDate: invoiceDates ? invoiceDates[1] : undefined,
        apiCriteria: {
          SessionID,
          SessionType,
          isIncludePatientOS,
          isIncludeGovtOS,
          isIncludeCorporateOS,
          isHasOutstanding,
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
  }
  const { outstandingBalanceStatus } = values
  const disabledOSOpts = outstandingBalanceStatus === undefined

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
                    disabledDate={(d) => !d || d.isAfter(moment().endOf('day'))}
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
        <GridContainer>
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
          <GridContainer md={2}>
            <GridItem md={4} style={{ marginTop: 30 }}>
              <Field
                name='isIncludePatientOS'
                render={(args) => (
                  <Checkbox
                    simple
                    label='Patient'
                    disabled={disabledOSOpts}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem md={4} style={{ marginTop: 30 }}>
              <Field
                name='isIncludeGovtOS'
                render={(args) => (
                  <Checkbox
                    simple
                    label='Govt.'
                    disabled={disabledOSOpts}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem md={4} style={{ marginTop: 30 }}>
              <Field
                name='isIncludeCorporateOS'
                render={(args) => (
                  <Checkbox
                    simple
                    label='Corporate'
                    disabled={disabledOSOpts}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
        </GridContainer>

        <div className={classes.searchButton}>
          <ProgressButton
            color='primary'
            icon={<Search />}
            onClick={onSearchClick}
          >
            <FormattedMessage id='form.search' />
          </ProgressButton>
          {/* <i>Double click on record to view invoice</i> */}
        </div>
      </React.Fragment>
    </SizeContainer>
  )
}

export default FilterBar
