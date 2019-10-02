import React, { PureComponent } from 'react'
import moment from 'moment'
import { Affix } from 'antd'
import { withFormik } from 'formik'
import { Book } from '@material-ui/icons'
import { withStyles, Paper } from '@material-ui/core'
import { NavPills, CommonHeader, CommonModal, Tabs } from '@/components'
import DetailsHeader from './DetailsHeader'
import Details from './Details'
// import CollectPayment from './CollectPayment'
import CollectPaymentConfirm from './CollectPaymentConfirm'
import { StatementDetailOption } from './variables'

const styles = () => ({})

@withFormik({
  mapPropsToValues: () => ({
    StatementNo: 'SM-000002',
  }),
})
class StatementDetails extends PureComponent {
  render () {
    const { values, theme } = this.props
    console.log('propss', this.state)
    return (
      <React.Fragment>
        <Paper>
          <DetailsHeader {...this.props} />
        </Paper>
        <Paper style={{ padding: 5 }}>
          {/* <NavPills
            color='primary'
            tabs={[
              {
                tabButton: 'Statement Details',
                tabContent: (
                  <div
                    style={{
                      paddingLeft: theme.spacing.unit * 2,
                      paddingRight: theme.spacing.unit * 2,
                    }}
                  >
                    <Details />
                  </div>
                ),
              },
              {
                tabButton: 'Payment Details',
                tabContent: (
                  <div style={{ padding: theme.spacing.unit * 2 }}>
                    <CollectPaymentConfirm />
                  </div>
                ),
              },
            ]}
          /> */}
          <Tabs
            style={{ marginTop: 20 }}
            defaultActiveKey='0'
            options={StatementDetailOption(this.props)}
          />

          {/* <Details /> */}
        </Paper>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(StatementDetails)
