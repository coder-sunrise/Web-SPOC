import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { FormattedMessage, formatMessage } from 'umi/locale'
import { Assignment } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'

import { compare } from '@/layouts'

import {
  PageHeaderWrapper,
  Card,
  CardHeader,
  CardIcon,
  CardBody,
  CardContainer,
} from '@/components'
import FilterBar from './FilterBar'
import Grid from './Grid'

const styles = () => ({
  header: {
    marginTop: 0,
    color: 'black',
  },
})
@connect(({ deposit }) => ({
  deposit,
}))
@compare('deposit')
class Deposit extends PureComponent {
  render () {
    // console.log(this)
    const { props } = this
    const { classes, ...restProps } = props
    return (
      <CardContainer hideHeader>
        <h4 className={classes.header}>
          {formatMessage({ id: 'finance.deposit.title' })}
        </h4>
        <FilterBar {...restProps} />
        <Grid {...restProps} />
      </CardContainer>
    )
  }
}

export default withStyles(styles)(Deposit)
