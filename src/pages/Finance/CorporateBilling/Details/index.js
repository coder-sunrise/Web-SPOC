import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import {
  withFormikExtend,
  CommonModal,
  serverDateFormat,
  GridContainer,
  GridItem,
  CardContainer,
} from '@/components'
import { withStyles, Paper } from '@material-ui/core'
import { ableToViewByAuthority } from '@/utils/utils'
import Header from './Header'
import InvoiceListing from './InvoiceListing'
import FilterBar from './FilterBar'
import Payment from './Payment'

const styles = () => ({})
@connect(({ billingDetails, user, codetable }) => ({
  billingDetails,
  user,
  codetable,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ billingDetails }) => {
    const { company, invoiceList, filterValues } = billingDetails
    return {
      company,
      invoiceList,
      filterValues,
    }
  },
})
class CorporateBillingDetails extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount = () => {
    const {
      dispatch,
      history,
      match: { params },
      setFieldValue,
    } = this.props
    if (params.id) {
      dispatch({
        type: 'billingDetails/resetFilterValues',
      })

      this.searchCompany(Number(params.id))
    } else {
      history.push('/finance/billing/')
    }
  }

  searchCompany = id => {
    const { dispatch, setFieldValue } = this.props

    dispatch({
      type: 'billingDetails/queryCompany',
      payload: {
        id,
      },
    }).then(() => {
      this.searchInvoice()
    })
  }

  searchInvoice = () => {
    const {
      setFieldValue,
      dispatch,
      values,
      values: { company },
    } = this.props

    const {
      invoiceNo,
      patientName,
      patientAccountNo,
      invoiceStartDate,
      invoiceEndDate,
      outstandingBalanceStatus,
      pagesize,
    } = values.filterValues

    dispatch({
      type: 'billingDetails/updateState',
      payload: { filterValues: values.filterValues },
    })

    const payload = {
      lgteql_invoiceDate: invoiceStartDate || undefined,
      lsteql_invoiceDate: invoiceEndDate || undefined,
      pagesize,
      group: [
        {
          invoiceNo,
          'VisitInvoice.VisitFKNavigation.PatientProfileFkNavigation.Name': patientName,
          'VisitInvoice.VisitFKNavigation.PatientProfileFkNavigation.PatientAccountNo': patientAccountNo,
          combineCondition: 'and',
        },
      ],
      apiCriteria: {
        companyFK: company.id,
        outstandingBalanceStatus,
      },
    }

    dispatch({
      type: 'billingDetails/queryCoPayerInvoice',
      payload,
    }).then(() => {
      const {
        billingDetails: { invoiceList },
      } = this.props
      setFieldValue('invoiceList', invoiceList)
    })
  }

  render() {
    return (
      <React.Fragment>
        <Paper>
          <Header {...this.props} />
        </Paper>
        <Paper>
          <CardContainer hideHeader>
            <div className='filterBar'>
              <FilterBar {...this.props} searchInvoice={this.searchInvoice} />
            </div>
            <GridContainer style={{ marginTop: 18 }}>
              <GridItem
                md={
                  ableToViewByAuthority('finance.addpastsessioncopayerpayment')
                    ? 9
                    : 12
                }
              >
                <InvoiceListing
                  {...this.props}
                  isEnableAddPayment={ableToViewByAuthority(
                    'finance.addpastsessioncopayerpayment',
                  )}
                />
              </GridItem>
              {ableToViewByAuthority(
                'finance.addpastsessioncopayerpayment',
              ) && (
                <GridItem md={3}>
                  <Payment {...this.props} searchCompany={this.searchCompany} />
                </GridItem>
              )}
            </GridContainer>
          </CardContainer>
        </Paper>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(CorporateBillingDetails)
