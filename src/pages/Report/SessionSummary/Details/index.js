import React from 'react'
import { Collapse } from 'antd'
// common components
import { GridContainer, GridItem } from '@/components'
import PaymentCollections from './PaymentCollections'
import PaymentSummary from './PaymentSummary'
import SessionDetails from './SessionDetails'
import ReportBase from '../../ReportBase'

const reportId = 5
const fileName = 'Session Summary Report'

class SessionSummary extends ReportBase {
  constructor (props) {
    super(props) 
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
          <Collapse style={{ fontSize:'inherit' }} expandIconPosition='right' defaultActiveKey={['0']}>
            <Collapse.Panel header={<div style={{fontWeight: 500}}>Summary</div>} key={0}>
              <GridItem md={12}>
                <PaymentSummary PaymentSummaryDetails={reportDatas.PaymentDetails} />
              </GridItem> 
            </Collapse.Panel>
          </Collapse>
        </GridItem>
        <GridItem md={12} style={{ marginBottom: 8, marginTop: 8 }}>
          <Collapse style={{ fontSize:'inherit', padding:5 }} expandIconPosition='right' defaultActiveKey={['0']}>
            <Collapse.Panel header={<div style={{fontWeight: 500}}>Details</div>} key={0}>
              <GridItem md={12} style={{ marginBottom: 8, marginTop: 8 }}>
                <h5>Payment Collections</h5>
              </GridItem>
              <GridItem md={12}>
                <PaymentCollections
                  PaymentCollectionsDetails={reportDatas.PaymentCollections}
                  TotalDetails={reportDatas.PaymentTotal}
                />
              </GridItem>
              <GridItem md={12} style={{ marginBottom: 8, marginTop: 18 }}>
                <h5>Payment Collections for Past Invoices (Company)</h5>
              </GridItem>
              <GridItem md={12}>
                <PaymentCollections
                  PaymentCollectionsDetails={reportDatas.CompanyPastPaymentCollections}
                  TotalDetails={reportDatas.CompanyPastPaymentTotal}
                  isCompanyPaymentCollectionsForPast
                />
              </GridItem>
              <GridItem md={12} style={{ marginBottom: 8, marginTop: 18 }}>
                <h5>Payment Collections for Past Invoices (Private)</h5>
              </GridItem>
              <GridItem md={12}>
                <PaymentCollections
                  PaymentCollectionsDetails={reportDatas.PrivatePastPaymentCollections}
                  TotalDetails={reportDatas.PrivatePastPaymentTotal}
                />
              </GridItem>
            </Collapse.Panel>
          </Collapse>
        </GridItem> 
      </GridContainer>
    )
  }
}

export default SessionSummary
