import React, { useState, useCallback } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// ant design
import { Divider } from 'antd'
// common components
import _ from 'lodash'
import {
  Button,
  CardContainer,
  GridContainer,
  GridItem,
  NumberInput,
  Popover,
} from '@/components'
// utils
import { roundTo, ableToViewByAuthority } from '@/utils/utils'
import { INVOICE_REPORT_TYPES } from '@/utils/constants'
import Payments from './Payments'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'

const styles = () => ({
  crossed: {
    textDecorationLine: 'line-through',
  },
  errorContainer: {
    textAlign: 'left',
    lineHeight: '1em',
    paddingBottom: 8,
    '& span': {
      fontSize: '.8rem',
    },
  },
  rightAlign: {
    textAlign: 'right',
  },
  invoiceButton: {
    paddingLeft: 0,
  },
  addPaymentButton: {
    paddingRight: 0,
    marginRight: 0,
  },
  currencyValue: {
    fontWeight: 500,
    color: 'darkblue',
  },
})

const InvoiceSummary = ({
  classes,
  handleAddPaymentClick,
  handleDeletePaymentClick,
  handlePrintInvoiceClick,
  handlePrintReceiptClick,
  disabled,
  values,
  setFieldValue,
  isEnableVisitationInvoiceReport,
  handlePrintVisitInvoiceClick,
}) => {
  const errorMessage = 'Cancel reason is required'

  const [showError, setShowError] = useState(false)
  const [showAddPaymentMenu, setShowAddPaymentMenu] = useState(false)
  const [showPrintInvoiceMenu, setShowPrintInvoiceMenu] = useState(false)

  const { invoicePayment, invoice, patientID, visitOrderTemplateFK } = values
  const {
    gstValue,
    gstAmount,
    totalAftGst,
    invoiceNo,
    isGstInclusive,
    outstandingBalance,
  } = invoice

  let totalCashRound = 0
  invoicePayment
    .filter(o => !o.isCancelled && o.id)
    .forEach(o => {
      totalCashRound += _.sumBy(
        o.invoicePaymentMode || [],
        payment => payment.cashRounding,
      )
    })

  const handleConfirmDelete = useCallback(
    (id, toggleVisibleCallback) => {
      const payment = invoicePayment.find(
        item => parseInt(item.id, 10) === parseInt(id, 10),
      )

      if (payment.cancelReason === '' || payment.cancelReason === undefined) {
        setShowError(true)
      } else {
        toggleVisibleCallback()
        handleDeletePaymentClick(id)
      }
    },
    [invoicePayment],
  )

  const onCancelReasonChange = event => {
    if (event.target.value !== '' || event.target.value !== undefined)
      setShowError(false)
  }

  const shouldDisableIndividualPayment =
    outstandingBalance !== undefined && outstandingBalance <= 0
  const shouldDisableAddPayment = disabled || shouldDisableIndividualPayment

  const handleCancelClick = useCallback(
    id => {
      const index = invoicePayment.findIndex(
        item => parseInt(item.id, 10) === parseInt(id, 10),
      )
      setFieldValue(`invoicePayment[${index}].cancelReason`, undefined)
    },
    [invoicePayment],
  )
  return (
    <React.Fragment>
      <GridItem md={10}>
        <CardContainer hideHeader>
          <GridContainer justify='space-between'>
            {gstValue >= 0 && (
              <React.Fragment>
                <GridItem md={6}>
                  <h5>
                    {roundTo(gstValue).toFixed(2)}% GST
                    {isGstInclusive ? ' inclusive' : ''}
                  </h5>
                </GridItem>
                <GridItem md={6} className={classes.rightAlign}>
                  <h5 className={classes.currencyValue}>
                    <NumberInput value={gstAmount} text currency />
                  </h5>
                </GridItem>
              </React.Fragment>
            )}
            <GridItem md={6}>
              <h5 style={{ fontWeight: 500 }}>Final Bill</h5>
            </GridItem>
            <GridItem md={6} className={classes.rightAlign}>
              <h5 className={classes.currencyValue}>
                <NumberInput value={totalAftGst} showZero text currency />
              </h5>
            </GridItem>
            <GridItem md={6}>
              <h5 style={{ fontWeight: 500 }}>Total Claims</h5>
            </GridItem>
            <GridItem md={6} className={classes.rightAlign}>
              <h5 className={classes.currencyValue}>
                <NumberInput value={values.finalClaim} showZero text currency />
              </h5>
            </GridItem>
            <GridItem md={12}>
              <Divider
                style={{
                  width: '100%',
                  height: 1,
                  margin: '12px 0',
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <h5 style={{ fontWeight: 500 }}>Outstanding</h5>
            </GridItem>
            <GridItem md={6} className={classes.rightAlign}>
              <h5 className={classes.currencyValue}>
                <NumberInput
                  value={outstandingBalance}
                  showZero
                  text
                  currency
                />
              </h5>
            </GridItem>
          </GridContainer>
        </CardContainer>
      </GridItem>
      <GridItem md={10}>
        <CardContainer hideHeader>
          <h4 style={{ fontWeight: 500 }}>Payment</h4>
          <GridContainer justify='space-between'>
            <GridItem container md={12}>
              <Payments
                invoicePayment={invoicePayment.filter(x => x.id)}
                onCancelReasonChange={onCancelReasonChange}
                showError={showError}
                errorMessage={errorMessage}
                handleCancelClick={handleCancelClick}
                handleConfirmDelete={handleConfirmDelete}
                handlePrintReceiptClick={handlePrintReceiptClick}
              />
            </GridItem>
            <GridItem md={6}>
              {totalCashRound !== 0 && <span>Cash Rounding</span>}
            </GridItem>
            <GridItem md={6} className={classes.rightAlign}>
              {totalCashRound !== 0 && (
                <NumberInput
                  currency
                  text
                  value={totalCashRound}
                  style={{ padding: '0px 8px' }}
                />
              )}
            </GridItem>
            <GridItem md={12}>
              <Divider
                style={{
                  width: '100%',
                  height: 1,
                  margin: '12px 0',
                }}
              />
            </GridItem>
            <GridItem md={3}>
              <span>
                <Popover
                  icon={null}
                  trigger='click'
                  placement='right'
                  visible={showPrintInvoiceMenu}
                  onVisibleChange={() => {
                    if (visitOrderTemplateFK) {
                      setShowPrintInvoiceMenu(!showPrintInvoiceMenu)
                    } else {
                      handlePrintInvoiceClick(
                        INVOICE_REPORT_TYPES.INDIVIDUALINVOICE,
                      )
                    }
                  }}
                  content={
                    <MenuList
                      role='menu'
                      onClick={() => setShowPrintInvoiceMenu(false)}
                    >
                      {visitOrderTemplateFK && (
                        <MenuItem
                          onClick={() =>
                            handlePrintInvoiceClick(
                              INVOICE_REPORT_TYPES.SUMMARYINVOICE,
                            )
                          }
                        >
                          Summary Invoice
                        </MenuItem>
                      )}
                      <MenuItem
                        onClick={() =>
                          handlePrintInvoiceClick(
                            INVOICE_REPORT_TYPES.INDIVIDUALINVOICE,
                          )
                        }
                      >
                        Individual Invoice
                      </MenuItem>
                    </MenuList>
                  }
                >
                  <Button
                    color='primary'
                    simple
                    size='sm'
                    className={classes.invoiceButton}
                    disabled={disabled}
                  >
                    Print Invoice
                  </Button>
                </Popover>
              </span>
            </GridItem>

            <GridItem md={5}>
              {isEnableVisitationInvoiceReport && (
                <Button
                  color='primary'
                  simple
                  size='sm'
                  className={classes.invoiceButton}
                  onClick={handlePrintVisitInvoiceClick}
                  disabled={disabled}
                >
                  Print Visit Invoice
                </Button>
              )}
            </GridItem>

            <GridItem md={3} className={classes.rightAlign}>
              {ableToViewByAuthority(
                'finance.addcurrentsessionpatientpayment',
              ) && (
                <Popover
                  icon={null}
                  trigger='click'
                  placement='right'
                  visible={showAddPaymentMenu}
                  onVisibleChange={() => {
                    handleAddPaymentClick()
                  }}
                  content={
                    <MenuList
                      role='menu'
                      onClick={() => setShowAddPaymentMenu(false)}
                    >
                      <MenuItem
                        disabled={shouldDisableIndividualPayment}
                        onClick={() => handleAddPaymentClick()}
                      >
                        Individual Payment
                      </MenuItem>
                    </MenuList>
                  }
                >
                  <Button
                    color='primary'
                    simple
                    size='sm'
                    className={classes.addPaymentButton}
                    disabled={shouldDisableAddPayment}
                  >
                    Add Payment
                  </Button>
                </Popover>
              )}
            </GridItem>
          </GridContainer>
        </CardContainer>
      </GridItem>
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'InvoiceSummary' })(InvoiceSummary)
