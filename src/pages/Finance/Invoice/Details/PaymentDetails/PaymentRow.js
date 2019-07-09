import React from 'react'
// material ui
import { IconButton, withStyles } from '@material-ui/core'
import Cross from '@material-ui/icons/HighlightOff'
// common components
import { GridContainer, GridItem, Tooltip } from '@/components'
import styles from './styles'

const PaymentRow = ({
  type,
  itemID,
  date,
  amount,
  classes,
  handleVoidClick,
}) => {
  const onVoidClick = () => handleVoidClick({ type, itemID })

  return (
    <GridContainer
      justify='center'
      alignItems='center'
      className={classes.rowContainer}
    >
      <GridItem md={2}>
        <span>{type}</span>
      </GridItem>
      <GridItem md={2}>
        <span>{itemID}</span>
      </GridItem>
      <GridItem md={2}>
        <span>{date}</span>
      </GridItem>
      <GridItem md={6} container justify='flex-end' alignItems='center'>
        <GridItem>
          <span className={classes.currency}>${amount}</span>
        </GridItem>
        <GridItem>
          <Tooltip title='Void'>
            <IconButton id={itemID} onClick={onVoidClick}>
              <Cross />
            </IconButton>
          </Tooltip>
        </GridItem>
      </GridItem>
    </GridContainer>
  )
}

export default withStyles(styles, { name: 'PaymentRow' })(PaymentRow)
