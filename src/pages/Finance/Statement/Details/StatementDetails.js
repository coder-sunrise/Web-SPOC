import React, { PureComponent } from 'react'
import moment from 'moment'
import { Affix } from 'antd'
import { withFormik } from 'formik'
import { Book } from '@material-ui/icons'
import { withStyles } from '@material-ui/core'
import { NavPills, CommonHeader } from '@/components'
import DetailsHeader from './DetailsHeader'
import Details from './Details'
import CollectPayment from './CollectPayment'

const styles = () => ({})

@withFormik({
  mapPropsToValues: () => ({
    StatementNo: 'SM-000002',
  }),
})
class StatementDetails extends PureComponent {
  render () {
    const { values, theme } = this.props
    return (
      <CommonHeader
        Icon={<Book />}
        titleId='finance.statement.statementNo'
        postFix={values.StatementNo}
      >
        <Affix target={() => window.mainPanel}>
          <DetailsHeader />
        </Affix>
        {/*
        <NavPills
          color='primary'
          tabs={[
            {
              tabButton: 'Details',
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
              tabButton: 'Collect Payment',
              tabContent: (
                <div style={{ padding: theme.spacing.unit * 2 }}>
                  <CollectPayment />
                </div>
              ),
            },
          ]}
        />
        */}
        <Details />
      </CommonHeader>
    )
  }
}

export default withStyles(styles, { withTheme: true })(StatementDetails)
