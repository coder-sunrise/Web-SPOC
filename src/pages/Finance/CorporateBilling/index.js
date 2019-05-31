import React, { PureComponent } from 'react'
import { FormattedMessage, formatMessage } from 'umi/locale'
import { Assignment } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'

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
  render () {
    const { classes } = this.props
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id='app.forms.basic.title' />}
        content={<FormattedMessage id='app.forms.basic.description' />}
      >
        <Card>
          <CardBody>
            <h4 className={classes.cardIconTitle}>
              {formatMessage({ id: 'finance.corporate-billing.title' })}
            </h4>
            <FilterBar />
            <CorporateBillingGrid />
          </CardBody>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default withStyles(styles)(CorporateBilling)
