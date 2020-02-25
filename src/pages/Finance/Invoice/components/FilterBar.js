import React from 'react'
// formik
import { FastField, Field, withFormik } from 'formik'
import { FormattedMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'
// common components
import {
  Button,
  ProgressButton,
  GridContainer,
  GridItem,
  SizeContainer,
  TextField,
  Select,
} from '@/components'
import { FilterBarDate } from '@/components/_medisys'
import { getBizSession } from '@/services/queue'
import { osBalanceStatus, sessionOptions } from '@/utils/codes'

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

const FilterBar = ({ classes, dispatch, values, handleSubmit }) => {
  const { invoiceStartDate, invoiceEndDate } = values

  const handleReset = () => {
    dispatch({
      type: 'invoiceList/resetFilter',
    })
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
          <GridItem md={3}>
            <Field
              name='invoiceStartDate'
              render={(args) => (
                <FilterBarDate
                  args={args}
                  label='Invoice Date From'
                  formValues={{
                    startDate: invoiceStartDate,
                    endDate: invoiceEndDate,
                  }}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='invoiceEndDate'
              render={(args) => (
                <FilterBarDate
                  args={args}
                  label='Invoice Date To'
                  isEndDate
                  formValues={{
                    startDate: invoiceStartDate,
                    endDate: invoiceEndDate,
                  }}
                />
              )}
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
        </GridContainer>

        <div className={classes.searchButton}>
          <ProgressButton
            color='primary'
            icon={<Search />}
            onClick={handleSubmit}
          >
            <FormattedMessage id='form.search' />
          </ProgressButton>
          <Button onClick={handleReset}>Reset</Button>
          {/* <i>Double click on record to view invoice</i> */}
        </div>
      </React.Fragment>
    </SizeContainer>
  )
}

export default withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ invoiceList }) => ({ ...invoiceList.filterValues }),
  handleSubmit: async (values, { props }) => {
    const { dispatch } = props
    const {
      invoiceNo,
      patientName,
      patientAccountNo,
      invoiceStartDate,
      invoiceEndDate,
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

    const payload = {
      lgteql_invoiceDate: invoiceStartDate || undefined,
      lsteql_invoiceDate: invoiceEndDate || undefined,
      lgt_OutstandingBalance:
        outstandingBalanceStatus === 'yes' && outstandingBalanceStatus !== 'all'
          ? '0'
          : undefined,
      lsteql_OutstandingBalance:
        outstandingBalanceStatus === 'no' && outstandingBalanceStatus !== 'all'
          ? '0'
          : undefined,
      apiCriteria: {
        SessionID,
        SessionType,
      },
      group: [
        {
          invoiceNo,
          'VisitInvoice.VisitFKNavigation.PatientProfileFkNavigation.Name': patientName,
          'VisitInvoice.VisitFKNavigation.PatientProfileFkNavigation.PatientAccountNo': patientAccountNo,
          combineCondition: 'and',
        },
      ],
    }

    dispatch({
      type: 'invoiceList/query',
      payload,
    })
    dispatch({
      type: 'invoiceList/updateState',
      payload: {
        filterValues: {
          ...values,
        },
      },
    })
  },
})(FilterBar)
