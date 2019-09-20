import React from 'react'
// material ui
import { IconButton, withStyles } from '@material-ui/core'
import Printer from '@material-ui/icons/Print'
import Info from '@material-ui/icons/Info'
import Cross from '@material-ui/icons/HighlightOff'
// common components
import { GridContainer, GridItem, Tooltip } from '@/components'
import styles from './styles'

const PaymentRow = ({
  type,
  itemID,
  date,
  amount,
  reason,
  classes,
  handleVoidClick,
  handlePrinterClick,
}) => {
  const onVoidClick = () => handleVoidClick({ type, itemID })

  return (
    <GridContainer
      justify='center'
      alignItems='center'
      className={classes.rowContainer}
    >
      <GridItem md={2}>
        {type === 'Payment' ? (
          <IconButton
            id={itemID}
            className={classes.printButton}
            onClick={handlePrinterClick}
          >
            <Printer />
          </IconButton>
        ) : (
          <Tooltip title={reason}>
            <IconButton className={classes.infoButton}>
              <Info />
            </IconButton>
          </Tooltip>
        )}
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
