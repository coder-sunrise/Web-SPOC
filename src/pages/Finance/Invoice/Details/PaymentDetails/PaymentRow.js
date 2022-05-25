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
  Button,
  GridContainer,
  GridItem,
  Tooltip,
  dateFormatLong,
  Popper,
  NumberInput,
} from '@/components'
import styles from './styles'
import PaymentDetails from './PaymentDetails'
import { ableToViewByAuthority } from '@/utils/utils'

const PaymentRow = ({
  classes,
  handleVoidClick,
  handlePrinterClick,
  readOnly,
  isEnableWriteOffinInvoice,
  printDisabled = false,
  isEnableDeletePayment = true,
  isEnableDeleteCreditNote = true,
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
    invoicePaymentMode = [],
    cancelReason,
    statementPaymentReceiptNo,
  } = payment

  const sortedInvoicePaymentModes = [...invoicePaymentMode].sort((a, b) =>
    a.id > b.id ? 1 : -1,
  )

  const [hoveredRowId, setHoveredRowId] = useState(null)

  let tooltipMsg = ''
  let showVoidButton = true
  if (type === 'Write Off') {
    if (isEnableWriteOffinInvoice) {
      showVoidButton = ableToViewByAuthority('finance.deletewriteoff')
    } else {
      showVoidButton = false
    }
  }
  if (type === 'Payment') {
    showVoidButton = isEnableDeletePayment
    tooltipMsg = 'Print Receipt'
  } else if (type === 'Credit Note') {
    showVoidButton = isEnableDeleteCreditNote
    tooltipMsg = 'Print Credit Note'
  }
  const getIconByType = () => {
    if (type === 'Payment' || type === 'Credit Note') {
      return (
        <Tooltip title={tooltipMsg}>
          <Button
            justIcon
            simple
            size='sm'
            color='primary'
            id={itemID}
            className={classes.printButton}
            disabled={
              isCancelled || !!statementPaymentReceiptNo || printDisabled
            }
            onClick={() => handlePrinterClick(type, id)}
          >
            <Printer />
          </Button>
        </Tooltip>
      )
    }
    if (type === 'Corporate Charges' || type === 'Statement Adjustment') {
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
    cursor: 'default',
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
          {type === 'Payment' ||
          (['Credit Note', 'Write Off', 'Deposit'].includes(type) &&
            isCancelled) ? (
            <Popper
              className={classNames({
                [classes.pooperResponsive]: true,
                [classes.pooperNav]: true,
              })}
              style={{
                width: 450,
                border: '1px solid',
                zIndex: 9999,
              }}
              disabledTransition
              placement='right'
              overlay={
                <PaymentDetails
                  paymentModeDetails={sortedInvoicePaymentModes}
                  setHoveredRowId={setHoveredRowId}
                  id={id}
                  cancelReason={cancelReason}
                  isCancelled={isCancelled}
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
          <span>
            {itemID}
            {statementPaymentReceiptNo && `(${statementPaymentReceiptNo})`}
          </span>
        </GridItem>
        <GridItem md={2}>
          <span>{moment(date).format(dateFormatLong)}</span>
        </GridItem>
        <GridItem md={6} container justify='flex-end' alignItems='center'>
          <GridItem>
            <span className={classes.currency}>
              {amount ? <NumberInput text currency value={amount} /> : 'N/A'}
            </span>
          </GridItem>
          <GridItem style={{ width: '30px' }}>
            {showVoidButton && (
              <Tooltip
                title='Delete Selected item'
                style={{
                  visibility: isCancelled === undefined ? 'hidden' : 'visible',
                }}
              >
                <Button
                  justIcon
                  simple
                  size='sm'
                  color='danger'
                  id={itemID}
                  onClick={() => handleVoidClick(payment)}
                  disabled={
                    isCancelled || readOnly || !!statementPaymentReceiptNo
                  }
                >
                  <Cross />
                </Button>
              </Tooltip>
            )}
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
              <span className={classes.currency}>
                {patientDepositTransaction.amount ? (
                  <NumberInput
                    text
                    currency
                    value={patientDepositTransaction.amount}
                  />
                ) : (
                  'N/A'
                )}
              </span>
            </GridItem>
            <GridItem style={{ width: '30px' }}></GridItem>
          </GridItem>
        </GridContainer>
      )}
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'PaymentRow' })(PaymentRow)
