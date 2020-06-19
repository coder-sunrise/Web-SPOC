import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
import _ from 'lodash'
import { Add, Print } from '@material-ui/icons'
// material ui
import { Paper, withStyles } from '@material-ui/core'
// common utils
import { INVOICE_PAYER_TYPE } from '@/utils/constants'
// common components
import {
  Button,
  GridContainer,
  GridItem,
  Select,
  CommonTableGrid,
  EditableTableGrid,
  CardContainer,
} from '@/components'
// sub components
import MaxCap from './MaxCap'
import BalanceLabel from './BalanceLabel'
import DeleteWithPopover from '../components/DeleteWithPopover'
import NotEditableInfo from '../components/NotEditableInfo'
import {
  SchemeInvoicePayerColumn,
  CompanyInvoicePayerColumn,
  ApplyClaimsColumnExtension,
} from '../variables'
import PaymentSummary from '@/pages/Finance/Invoice/Details/PaymentDetails/PaymentSummary'
import PaymentRow from '@/pages/Finance/Invoice/Details/PaymentDetails/PaymentRow'

const styles = (theme) => ({
  gridRow: {
    margin: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),

    '& > h5': {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
  },
  dangerText: {
    fontWeight: 500,
    color: '#cf1322',
  },
  currencyText: {
    fontWeight: 500,
    color: 'darkblue',
  },
  gridActionBtn: {
    textAlign: 'right',
    marginTop: theme.spacing(1),
  },
  rightEndBtn: {
    marginRight: 0,
  },
})

const validationSchema = Yup.object().shape({
  eligibleAmount: Yup.number(),
  payableBalance: Yup.number(),
  claimAmount: Yup.number().when(
    [
      'eligibleAmount',
      'payableBalance',
    ],
    (eligibleAmount, payableBalance) => {
      const _checkAmount = eligibleAmount || payableBalance

      if (_checkAmount) {
        return Yup.number().max(
          _checkAmount,
          `Cannot claim more than $${_checkAmount.toFixed(2)}`,
        )
      }
      return Yup.number()
    },
  ),
})

const Scheme = ({
  _key,
  classes,
  invoicePayer,
  index,
  hasOtherEditing,
  onCancelClick,
  onEditClick,
  onApplyClick,
  onDeleteClick,
  onSchemeChange,
  onCommitChanges,
  onPaymentVoidClick,
  onPrinterClick,
  onAddPaymentClick,
}) => {
  const {
    name,
    payerTypeFK,
    companyFK,
    schemeConfig = {},
    copaymentSchemeFK,
    _isConfirmed,
    _isEditing,
    _isAppliedOnce,
    claimableSchemes = [],
    invoicePayerItem,
    id,
    _hasError = false,
    hasPayments = false,
    chasClaimStatuses = [],
    payerDistributedAmt,
    payerOutstanding,
    invoicePayment = [],
  } = invoicePayer

  const handleSchemeChange = (value) => onSchemeChange(value, index)
  const handleCancelClick = () => onCancelClick(index)
  const handleEditClick = () => onEditClick(index)
  const handleApplyClick = () => onApplyClick(index)
  const handleDeleteClick = () => onDeleteClick(index)

  const shouldDisableDelete = () => {
    const statuses = chasClaimStatuses.map((status) => status.toLowerCase())
    if (
      hasPayments ||
      statuses.includes('draft') ||
      statuses.includes('approved')
    )
      return true
    return _isEditing ? false : hasOtherEditing
  }

  const columnExtensions = [
    ...ApplyClaimsColumnExtension,
    {
      columnName: 'claimAmount',
      align: 'right',
      type: 'currency',
      width: 150,
      currency: true,
      disabled: _isConfirmed,
    },
  ]

  const showGrid = companyFK || !_.isEmpty(schemeConfig)
  const disableEdit =
    payerTypeFK === INVOICE_PAYER_TYPE.SCHEME &&
    id !== undefined &&
    _.isEmpty(schemeConfig)
  const titleColor = disableEdit ? 'grey' : 'darkblue'

  const ButtonProps = {
    icon: true,
    simple: true,
    color: 'primary',
    size: 'sm',
  }

  const shoulddisable = () => {
    return _isEditing || hasOtherEditing
  }

  const payments = invoicePayment.map((o) => {
    return { ...o, type: 'Payment' }
  })
  const onPaymentDeleteClick = (payment) => {
    onPaymentVoidClick(index, payment.id)
  }
  return (
    <Paper key={_key} elevation={4} className={classes.gridRow}>
      <GridContainer style={{ marginBottom: 16 }} alignItems='flex-start'>
        <GridItem md={3} style={{ marginTop: 8, marginBottom: 16 }}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              fontWeight: 500,
              fontSize: '1rem',
              color: titleColor,
            }}
          >
            {disableEdit && <NotEditableInfo />}
            {payerTypeFK === INVOICE_PAYER_TYPE.SCHEME &&
            _isEditing && (
              <Select
                style={{ width: '100%' }}
                size='sm'
                allowClear={false}
                simple
                valueField='id'
                onChange={handleSchemeChange}
                value={copaymentSchemeFK}
                disabled={_isConfirmed}
                options={[
                  ...claimableSchemes.map((item) => ({
                    id: item.id,
                    name: item.coPaymentSchemeName,
                  })),
                ]}
              />
            )}
            {payerTypeFK === INVOICE_PAYER_TYPE.COMPANY &&
            _isEditing && <span>{name}</span>}

            {_isConfirmed && <span>{name}</span>}
          </div>
        </GridItem>
        {schemeConfig &&
        schemeConfig.copayerFK === 1 && (
          <GridItem md={2} style={{ marginTop: 8, marginBottom: 8 }}>
            <BalanceLabel schemeConfig={schemeConfig} />
          </GridItem>
        )}
        <GridItem md={2} style={{ marginTop: 8, marginBottom: 8 }}>
          <MaxCap
            payerTypeFK={payerTypeFK}
            claimableSchemes={claimableSchemes}
            copaymentSchemeFK={copaymentSchemeFK}
            schemeConfig={schemeConfig}
          />
        </GridItem>
        <GridItem
          md={schemeConfig && schemeConfig.copayerFK === 1 ? 5 : 7}
          style={{
            textAlign: 'right',
            marginTop: 8,
            paddingRight: '0px !important',
          }}
        >
          <DeleteWithPopover
            index={index}
            disabled={shouldDisableDelete()}
            onConfirmDelete={handleDeleteClick}
          />
        </GridItem>
        {showGrid && (
          <GridItem md={12}>
            {_isEditing ? (
              <EditableTableGrid
                key={`editable-${_key}`}
                size='sm'
                FuncProps={{ pager: false }}
                EditingProps={{
                  showAddCommand: false,
                  showDeleteCommand: false,
                  onCommitChanges,
                }}
                columns={
                  payerTypeFK === INVOICE_PAYER_TYPE.SCHEME ? (
                    SchemeInvoicePayerColumn
                  ) : (
                    CompanyInvoicePayerColumn
                  )
                }
                columnExtensions={columnExtensions}
                rows={invoicePayerItem}
                schema={validationSchema}
              />
            ) : (
              <CommonTableGrid
                key={`editable-${_key}`}
                size='sm'
                FuncProps={{ pager: false }}
                columns={
                  payerTypeFK === INVOICE_PAYER_TYPE.SCHEME ? (
                    SchemeInvoicePayerColumn
                  ) : (
                    CompanyInvoicePayerColumn
                  )
                }
                columnExtensions={[
                  ...ApplyClaimsColumnExtension,
                  {
                    columnName: 'claimAmount',
                    align: 'right',
                    type: 'currency',
                    currency: true,
                    disabled: true,
                    width: 150,
                  },
                ]}
                rows={invoicePayerItem}

                // schema={validationSchema}
              />
            )}
          </GridItem>
        )}
        <GridItem md={8} />
        <GridItem md={4} className={classes.gridActionBtn}>
          {_isEditing && (
            <React.Fragment>
              {_isAppliedOnce && (
                <Button
                  size='sm'
                  color='danger'
                  onClick={handleCancelClick}
                  disabled={
                    payerTypeFK === INVOICE_PAYER_TYPE.SCHEME &&
                    copaymentSchemeFK === undefined
                  }
                >
                  Cancel
                </Button>
              )}
              <Button
                size='sm'
                color='primary'
                className={classes.rightEndBtn}
                onClick={handleApplyClick}
                disabled={_hasError}
              >
                Apply
              </Button>
            </React.Fragment>
          )}
          {_isConfirmed && (
            <Button
              size='sm'
              color='primary'
              className={classes.rightEndBtn}
              onClick={handleEditClick}
              disabled={disableEdit}
            >
              Edit
            </Button>
          )}
        </GridItem>
        <GridItem md={12}>
          <CardContainer hideHeader size='sm'>
            {payments
              .sort((a, b) => moment(a.date) - moment(b.date))
              .map((payment) => (
                <PaymentRow
                  {...payment}
                  handleVoidClick={onPaymentDeleteClick}
                  handlePrinterClick={onPrinterClick}
                  readOnly={shoulddisable()}
                />
              ))}
          </CardContainer>
        </GridItem>
        <GridItem md={7}>
          <div>
            <Button
              {...ButtonProps}
              disabled={shoulddisable()}
              onClick={() => onAddPaymentClick(index)}
            >
              <Add />
              Add Payment
            </Button>
            <Button
              {...ButtonProps}
              disabled={shoulddisable()}
              onClick={() => onPrinterClick('TaxInvoice', undefined, companyFK)}
            >
              <Print />
              Print Invoice
            </Button>
          </div>
        </GridItem>
        <GridItem
          md={5}
          container
          direction='column'
          justify='center'
          alignItems='flex-end'
        >
          <PaymentSummary
            payerDistributedAmt={payerDistributedAmt}
            outstanding={payerOutstanding}
          />
        </GridItem>
      </GridContainer>
    </Paper>
  )
}

export default withStyles(styles, { name: 'Scheme' })(Scheme)
