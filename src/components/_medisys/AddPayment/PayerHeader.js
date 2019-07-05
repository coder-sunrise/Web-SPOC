import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { GridContainer, GridItem } from '@/components'
// styling
import styles from './styles'

const PayerHeader = ({ classes }) => (
  <GridContainer justify='space-between' className={classes.payerHeader}>
    <GridItem md={3} className={classes.leftAlignText}>
      <h4>Payer: </h4>
      <h4>Lee Tian Kian</h4>
    </GridItem>
    <GridItem md={3} className={classes.centerText}>
      <h4>Total Payable: </h4>
      <h4>$20.00</h4>
    </GridItem>
    <GridItem md={3} className={classes.centerText}>
      <h4>Outstanding: </h4>
      <h4>$20.00</h4>
    </GridItem>
  </GridContainer>
)

export default withStyles(styles, { name: 'PayerHeader' })(PayerHeader)
