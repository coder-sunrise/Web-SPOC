import React from 'react'
import * as Yup from 'yup'
import _ from 'lodash'
// material ui
import { Paper, withStyles } from '@material-ui/core'
// common components
import {
  Button,
  GridContainer,
  GridItem,
  Select,
  CommonTableGrid,
  EditableTableGrid,
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
  // ApplyClaimsCopayerColumnExtension,
} from '../variables'

import { INVOICE_PAYER_TYPE } from '@/utils/constants'

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
  } = invoicePayer

  const handleSchemeChange = (value) => onSchemeChange(value, index)
  const handleCancelClick = () => onCancelClick(index)
  const handleEditClick = () => onEditClick(index)
  const handleApplyClick = () => onApplyClick(index)
  const handleDeleteClick = () => onDeleteClick(index)

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
            disabled={_isEditing ? false : hasOtherEditing}
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
      </GridContainer>
    </Paper>
  )
}

export default withStyles(styles, { name: 'Scheme' })(Scheme)
