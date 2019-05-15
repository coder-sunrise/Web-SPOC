import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { compare } from '@/layouts'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import { CardContainer } from '@/components'

import Grid from './Grid'
import FilterBar from './FilterBar'

const styles = (theme) => ({})
@connect(({ invoice }) => ({
  invoice,
}))
@compare('invoice')
class Invoice extends PureComponent {
  state = {}

  render () {
    const { classes, ...resetProps } = this.props

    return (
      <CardContainer title='Invoice / Payment'>
        <FilterBar {...resetProps} />
        <Grid {...resetProps} />
      </CardContainer>
    )
  }
}

export default withStyles(styles)(Invoice)
