import React from 'react'
import moment from 'moment'
// material ui
import { IconButton, withStyles } from '@material-ui/core'
import Printer from '@material-ui/icons/Print'
import Info from '@material-ui/icons/Info'
import Cross from '@material-ui/icons/HighlightOff'
// common components
import { GridContainer, GridItem, Tooltip, dateFormatLong } from '@/components'
import styles from './styles'

const PaymentRow = ({
  // id,
  // type,
  // itemID,
  // date,
  // amount,
  // reason,
  // isCancelled,
  classes,
  handleVoidClick,
  handlePrinterClick,
  readOnly,
  ...payment
}) => {
  const { id, type, itemID, date, amount, reason, isCancelled } = payment
  return (
    <GridContainer
      justify='center'
      alignItems='center'
      className={classes.rowContainer}
      style={isCancelled ? { textDecorationLine: 'line-through' } : {}}
    >
      <GridItem md={2}>
        {type === 'Payment' ? (
          <IconButton
            // payerID='N/A'
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
        <span>{moment(date).format(dateFormatLong)}</span>
        {/* <DatePicker text format={dateFormatLong} value={date} /> */}
      </GridItem>
      <GridItem md={6} container justify='flex-end' alignItems='center'>
        <GridItem>
          <span className={classes.currency}>${amount}</span>
        </GridItem>
        <GridItem>
          <Tooltip
            title='Void'
            style={{ visibility: isCancelled ? 'visible' : 'hidden' }}
          >
            <IconButton
              id={itemID}
              onClick={() => handleVoidClick(payment)}
              disabled={isCancelled || readOnly}
            >
              <Cross />
            </IconButton>
          </Tooltip>
        </GridItem>
      </GridItem>
    </GridContainer>
  )
}

export default withStyles(styles, { name: 'PaymentRow' })(PaymentRow)
