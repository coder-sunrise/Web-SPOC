import React, { PureComponent } from 'react'
import { FormattedMessage, formatMessage } from 'umi'
import { withStyles } from '@material-ui/core/styles'
import Authorized from '@/utils/Authorized'

import {
  PageHeaderWrapper,
  Card,
  CardHeader,
  CardIcon,
  CardBody,
} from '@/components'
import FilterBar from './FilterBar'
import CorporateBillingGrid from './CorporateBillingGrid'

const styles = () => ({
  header: {
    marginTop: 0,
    color: 'black',
  },
})

class CorporateBilling extends PureComponent {
  render() {
    const { classes } = this.props
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id='app.forms.basic.title' />}
        content={<FormattedMessage id='app.forms.basic.description' />}
      >
        <Authorized authority='finance/corporatebilling'>
          <Card>
            <CardBody>
              <h4 className={classes.cardIconTitle}>
                {formatMessage({ id: 'finance.corporate-billing.title' })}
              </h4>
              <FilterBar />
              <CorporateBillingGrid />
            </CardBody>
          </Card>
        </Authorized>
      </PageHeaderWrapper>
    )
  }
}

export default withStyles(styles)(CorporateBilling)
