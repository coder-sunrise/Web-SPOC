import React, { useState } from 'react'
import moment from 'moment'
import classNames from 'classnames'
// material ui
import { IconButton, withStyles } from '@material-ui/core'
import Printer from '@material-ui/icons/Print'
import Info from '@material-ui/icons/Info'
import Cross from '@material-ui/icons/HighlightOff'
// common components
import {
  GridContainer,
  GridItem,
  Tooltip,
  dateFormatLong,
  Popper,
} from '@/components'
import styles from './styles'
import { currencyFormatter } from '@/utils/utils'
import PaymentDetails from './PaymentDetails'

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
  const {
    id,
    type,
    itemID,
    date,
    amount,
    reason,
    isCancelled,
    patientDepositTransaction,
    invoicePaymentMode,
  } = payment

  const [
    hoveredRowId,
    setHoveredRowId,
  ] = useState(null)

  let tooltipMsg = ''
  if (type === 'Payment') tooltipMsg = 'Print Receipt'
  else if (type === 'Credit Note') tooltipMsg = 'Print Credit Note'

  const getIconByType = () => {
    if (type === 'Payment' || type === 'Credit Note') {
      return (
        <Tooltip title={tooltipMsg}>
          <IconButton
            // payerID='N/A'
            id={itemID}
            className={classes.printButton}
            disabled={isCancelled}
            onClick={() => handlePrinterClick(type, id)}
          >
            <Printer />
          </IconButton>
        </Tooltip>
      )
    }
    if (type === 'Admin Charge') {
      return ''
    }
    return (
      <Tooltip title={reason}>
        <IconButton className={classes.infoButton}>
          <Info />
        </IconButton>
      </Tooltip>
    )
  }

  const paymentTextStyle = {
    textDecoration: hoveredRowId ? 'underline' : null,
    padding: '5px 20px 5px 0px',
    // padding: 5,
  }

  return (
    <React.Fragment>
      <GridContainer
        justify='center'
        alignItems='center'
        className={classes.rowContainer}
        style={isCancelled ? { textDecorationLine: 'line-through' } : {}}
      >
        <GridItem md={2}>
          {getIconByType()}
          {type === 'Payment' ? (
            <Popper
              className={classNames({
                [classes.pooperResponsive]: true,
                [classes.pooperNav]: true,
              })}
              style={{
                width: 450,
                border: '1px solid',
              }}
              disabledTransition
              placement='right'
              overlay={
                <PaymentDetails
                  paymentModeDetails={invoicePaymentMode}
                  setHoveredRowId={setHoveredRowId}
                  id={id}
                />
              }
            >
              <span
                style={paymentTextStyle}
                onMouseOver={() => setHoveredRowId(id)}
                onMouseOut={() => setHoveredRowId(null)}
                onFocus={() => 0}
                onBlur={() => 0}
              >
                {type}
              </span>
            </Popper>
          ) : (
            <span>{type}</span>
          )}
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
            <span className={classes.currency}>
              {amount ? currencyFormatter(amount) : 'N/A'}
            </span>
          </GridItem>
          <GridItem>
            <Tooltip
              title='Delete Selected item'
              style={{
                visibility: isCancelled === undefined ? 'hidden' : 'visible',
              }}
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
      {patientDepositTransaction && (
        <GridContainer
          justify='center'
          alignItems='center'
          className={classes.rowContainer}
          style={isCancelled ? { textDecorationLine: 'line-through' } : {}}
        >
          <GridItem md={2}>
            <Tooltip title='Deposit transaction'>
              <IconButton className={classes.infoButton}>
                <Info />
              </IconButton>
            </Tooltip>
            <span>Deposit</span>
          </GridItem>
          <GridItem md={2}>
            {patientDepositTransaction.depositTransactionNo}
          </GridItem>
          <GridItem md={2}>
            <span>
              {moment(patientDepositTransaction.transactionDate).format(
                dateFormatLong,
              )}
            </span>
          </GridItem>
          <GridItem md={6} container justify='flex-end' alignItems='center'>
            <GridItem>
              <span className={classes.currency} style={{ paddingRight: 40 }}>
                {patientDepositTransaction.amount ? (
                  currencyFormatter(patientDepositTransaction.amount)
                ) : (
                  'N/A'
                )}
              </span>
            </GridItem>
          </GridItem>
        </GridContainer>
      )}
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'PaymentRow' })(PaymentRow)
