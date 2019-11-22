import React from 'react'
import {
  NumberInput,
  GridContainer,
  GridItem,
  TextField,
  DatePicker,
} from '@/components'

const SessionDetails = ({ sessionDetails, companyDetails }) => {
  if (!sessionDetails)
    return null
  return (
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
      <GridItem md={3} style={{ marginBottom: 16 }}>
        <NumberInput
          label='Company Payable Amt.'
          disabled
          currency
          value={
            companyDetails.totalCompanyAmount ? (
              companyDetails.totalCompanyAmount
            ) : (
                0
              )
          }
        />
      </GridItem>
    </GridContainer>
  )
}

export default SessionDetails
