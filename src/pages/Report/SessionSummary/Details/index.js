import React from 'react'
// common components
import { GridContainer, GridItem } from '@/components'
import PaymentCollections from './PaymentCollections'
import PaymentSummary from './PaymentSummary'
import SessionDetails from './SessionDetails'
import ReportBase from '../../ReportBase'

const reportId = 5
const fileName = 'Session Summary Report'

class SessionSummary extends ReportBase {
  constructor(props) {
    super(props)
    console.log({ superState: super.state, thisState: this.state })
    this.state = {
      ...this.state,
      reportId,
      fileName,
    }
  }

  componentDidMount () {
    this.setState((state) => ({
      ...state.default,
    }))
    this.onSubmitClick()
  }

  formatReportParams = () => {
    return {
      sessionID: this.props.match
        ? this.props.match.params.id
        : this.props.sessionID,
    }
  }

  renderFilterBar = () => {
    return null
  }

  renderContent = (reportDatas) => {
    if (!reportDatas) return null
    return (
      <GridContainer>
        <SessionDetails
          sessionDetails={reportDatas.SessionDetails[0]}
          companyDetails={reportDatas.CompanyDetails[0]}
        />
        <GridItem md={12} style={{ marginBottom: 8, marginTop: 8 }}>
          <h4>Payment Collections</h4>
        </GridItem>
        <GridItem md={12}>
          <PaymentCollections
            PaymentCollectionsDetails={reportDatas.PaymentCollections}
            TotalDetails={reportDatas.PaymentTotal}
          />
        </GridItem>
        <GridItem md={12} style={{ marginBottom: 8, marginTop: 8 }}>
          <h4>Payment Collections for Past Invoices</h4>
        </GridItem>
        <GridItem md={12}>
          <PaymentCollections
            PaymentCollectionsDetails={reportDatas.PastPaymentCollections}
            TotalDetails={reportDatas.PastPaymentTotal}
          />
        </GridItem>
        <GridItem md={12} style={{ marginBottom: 8, marginTop: 8 }}>
          <h4>Payment Summary</h4>
        </GridItem>
        <GridItem md={12}>
          <PaymentSummary PaymentSummaryDetails={reportDatas.PaymentDetails} />
        </GridItem>
      </GridContainer>
    )
  }
}

export default SessionSummary
