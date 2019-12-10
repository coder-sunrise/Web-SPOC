import React, { useCallback } from 'react'
import * as Yup from 'yup'
import _ from 'lodash'
// material ui
import { Paper, withStyles } from '@material-ui/core'
import { TableInlineCellEditing } from '@devexpress/dx-react-grid-material-ui'
// common components
import {
  Button,
  GridContainer,
  GridItem,
  Select,
  NumberInput,
  CommonTableGrid,
  EditableTableGrid,
  TextField,
} from '@/components'
// sub components
import MaxCapInfo from '../components/MaxCapInfo'
import DeleteWithPopover from '../components/DeleteWithPopover'
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
    claimableSchemes,
    invoicePayerItem,
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
      currency: true,
      disabled: _isConfirmed,
    },
  ]

  const showGrid = companyFK || !_.isEmpty(schemeConfig)

  return (
    <Paper key={_key} elevation={4} className={classes.gridRow}>
      <GridContainer style={{ marginBottom: 16 }} alignItems='center'>
        <GridItem md={3} style={{ marginTop: 8, marginBottom: 16 }}>
          <p style={{ color: 'darkblue', fontWeight: 500, fontSize: '1rem' }}>
            {payerTypeFK === INVOICE_PAYER_TYPE.SCHEME ? (
              <Select
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
            ) : (
              <span>{name}</span>
            )}
          </p>
        </GridItem>
        {schemeConfig &&
        schemeConfig.copayerFK === 1 && (
          <GridItem md={2}>
            <div>
              {schemeConfig.balanceStatusCode.toUpperCase() === 'SC105' ? (
                <TextField text prefix='Balance:' value='Full Balance' />
              ) : (
                <NumberInput
                  currency
                  text
                  prefix='Balance:'
                  value={schemeConfig.balance}
                />
              )}
            </div>
          </GridItem>
        )}
        <GridItem md={2} style={{ marginTop: 8, marginBottom: 8 }}>
          {payerTypeFK === INVOICE_PAYER_TYPE.SCHEME && (
            <NumberInput
              currency
              text
              prefix='Max. Cap:'
              suffix={
                <MaxCapInfo
                  claimableSchemes={claimableSchemes}
                  copaymentSchemeFK={copaymentSchemeFK}
                />
              }
              value={schemeConfig ? schemeConfig.coverageMaxCap : 0}
            />
          )}
        </GridItem>
        <GridItem
          md={schemeConfig && schemeConfig.copayerFK === 1 ? 5 : 7}
          style={{ textAlign: 'right', paddingRight: '0px !important' }}
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
              disabled={hasOtherEditing}
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
