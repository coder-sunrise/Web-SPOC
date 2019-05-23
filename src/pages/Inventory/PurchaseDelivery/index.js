import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { getAppendUrl } from '@/utils/utils'
import { CardContainer } from '@/components'
import FilterBar from './FilterBar'
import Grid from './Grid'

const styles = () => ({})

const PurchaseDelivery = (props) => {
  const { classes, theme, purchaseDelivery, ...restProps } = props
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

export default withStyles(styles, { withTheme: true })(PurchaseDelivery)
