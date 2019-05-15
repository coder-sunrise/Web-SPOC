import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { FormattedMessage, formatMessage } from 'umi/locale'
import { Assignment } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'

import { compare } from '@/layouts'

import { CardContainer } from '@/components'
import FilterBar from './FilterBar'
import Grid from './Grid'

const styles = () => ({})
@connect(({ scheme }) => ({
  scheme,
}))
@compare('scheme')
class Scheme extends PureComponent {
  render () {
    // console.log(this)
    const { props } = this
    const { classes, ...restProps } = props
    return (
      <CardContainer
        hideHeader
        style={{
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <FilterBar {...restProps} />
        <Grid {...restProps} />
      </CardContainer>
    )
  }
}

export default withStyles(styles)(Scheme)
