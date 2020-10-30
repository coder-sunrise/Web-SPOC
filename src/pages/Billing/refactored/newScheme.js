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
import PaymentSummary from '@/pages/Finance/Invoice/Details/PaymentDetails/PaymentSummary'
import PaymentRow from '@/pages/Finance/Invoice/Details/PaymentDetails/PaymentRow'
import MaxCap from './MaxCap'
import BalanceLabel from './BalanceLabel'
import DeleteWithPopover from '../components/DeleteWithPopover'
import NotEditableInfo from '../components/NotEditableInfo'
import {
  SchemeInvoicePayerColumn,
  CompanyInvoicePayerColumn,
  ApplyClaimsColumnExtension,
} from '../variables'

const visitTypes = [
  'CDMP',
  'Vaccination',
  'Health Screening',
]

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
  onSchemePayerChange,
  onMediVisitTypeChange,
  onMediVaccinationChange,
  onCommitChanges,
  onPaymentVoidClick,
  onPrinterClick,
  onAddPaymentClick,
  fromBilling,
  patient,
  ctschemetype,
  ctcopaymentscheme,
  tempInvoicePayer,
  inventoryvaccination,
  invoice,
  clinicSettings = {},
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
    schemePayerFK,
    medisaveVisitType,
    payerName,
    // medisaveVaccinationFK,
    // medisaveVaccinationList = [],
  } = invoicePayer

  console.log('invoicePayer',invoicePayer)

  const { invoiceItems = [] } = invoice
  let existingOldPayerItem
  if (
    invoicePayerItem.find(
      (ipi) => !invoiceItems.find((ii) => ii.id === ipi.invoiceItemFK),
    )
  ) {
    existingOldPayerItem = true
  }

  const handleSchemeChange = (value) => onSchemeChange(value, index)
  const handleSchemePayerChange = (value) => onSchemePayerChange(value, index)
  const handleVisitTypeChange = (value) => onMediVisitTypeChange(value, index)
  const handleCancelClick = () => onCancelClick(index)
  const handleEditClick = () => onEditClick(index)
  const handleApplyClick = () => onApplyClick(index)
  const handleDeleteClick = () => onDeleteClick(index)

  const shouldDisableDelete = () => {
    if (invoicePayment.find((o) => o.isCancelled === false)) {
      return true
    }

    const statuses = chasClaimStatuses.map((status) => status.toLowerCase())
    if (
      hasPayments ||
      // statuses.includes('draft') ||
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
      isDisabled: (row) => _isConfirmed || !row.isClaimable,
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

  const getPayerList = (payerScheme) => {
    // copayment scheme get scheme type fk, use it to find schemefk in schemepayer
    const scheme = ctcopaymentscheme.find((a) => a.id === payerScheme.copaymentSchemeFK)
    const schemeType = scheme ? ctschemetype.find((c) => c.name === scheme.schemeTypeName) : []
    
    const addedSchemes = scheme ? tempInvoicePayer.filter((r) => r.copaymentSchemeFK !== scheme.id).map((a) => {return a.copaymentSchemeFK}) : []
    
    // console.log(scheme, schemeType, addedSchemes)

    return patient.schemePayer.filter((b) => b.schemeFK === schemeType.id && addedSchemes.indexOf(payerScheme.copaymentSchemeFK) < 0)
    .map((p) => {
      return {
        name: p.payerName,
        id: p.id,
        // balance: p.balance,
      }
    })
  }

  /* const getDefaultMedisaveVaccination = (invoiceItemCode) => {
    const item = inventoryvaccination.find(mv => mv.code === invoiceItemCode)
    if(!item) return null
    console.log('getDefaultMedisaveVaccination',item)

    return item.medisaveVaccination.id
  } */

  let payments = []
  payments = payments.concat(
    invoicePayment.map((o) => {
      return {
        ...o,
        type: 'Payment',
        itemID: o.receiptNo,
        date: o.paymentReceivedDate,
        amount: o.totalAmtPaid,
      }
    }),
  )
  const onPaymentDeleteClick = (payment) => {
    onPaymentVoidClick(index, payment)
  }
  const { isEnableAddPaymentInBilling = false } = clinicSettings

  let isCHAS = schemeConfig && schemeConfig.copayerFK === 1
  const isMedisave = payerTypeFK === INVOICE_PAYER_TYPE.PAYERACCOUNT
  const isMediVisit = isMedisave && visitTypes.find(v => v === medisaveVisitType)// !== '' // && name.includes('Visit') // visitTypes.filter(m => m === medisaveVisitType).length > 0
  /* let visitName = null
  if(isMediVisit && name.includes('500'))
    visitName = 'Medisave 500 Visit'
  if(isMediVisit && name.includes('700'))
    visitName = 'Medisave 700 Visit' */
  console.log('visitTypes', visitTypes, name)
  const isMediVaccination = isMediVisit && medisaveVisitType === 'Vaccination' // invoicePayerItem.length > 0 && invoicePayerItem.filter((o) => o.invoiceItemTypeFK === 3).length > 0
  console.log('isMedisave', isCHAS, isMedisave, isMediVisit, isMediVaccination)

  const firstVacc = inventoryvaccination.find(mv => mv.code === invoicePayerItem[0].itemCode)
  console.log('firstVacc',firstVacc)
  
  /* 
  const defaultVaccination = isMediVaccination && !medisaveVaccinationFK && firstVacc 
    ? firstVacc.medisaveVaccinationList.find(l => l.isDefault).medisaveVaccinationFK 
    : null
  const medisaveVaccinationLists = isMediVaccination && firstVacc ? firstVacc.medisaveVaccinationList.map(m => {
    return {
      name: m.name,
      id: m.medisaveVaccinationFK,
    }
  }) : []
  console.log('medisaveVaccinationLists',medisaveVaccinationLists, defaultVaccination)
  */

  console.log('invoicePayer',invoicePayer)
  const payerList = getPayerList(invoicePayer)
  console.log('payerList',payerList)

  // let binMid = 1
  // if(isCHAS)
  //   binMid = 5
  // else if(isMedisave)
  //   binMid = 1
  // else
  //   binMid = 7

  console.log('newInvoicePayer',invoicePayer)
  const payer = payerList.find(p => p.id === schemePayerFK)
  console.log('payer',payer)
  
  return (
    <Paper key={_key} elevation={4} className={classes.gridRow}>
      <GridContainer style={{ marginBottom: 16 }} alignItems='flex-start'>
        <GridItem md={6} style={{ marginTop: 8, marginBottom: 16 }}>
          {/* Copayment Scheme [Only chas can select] */}
          <span
            style={{
              width: '100%',
              display: 'flex',
              fontWeight: 500,
              fontSize: '1rem',
              color: titleColor,
              marginRight: 20,
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
            {payerTypeFK !== INVOICE_PAYER_TYPE.SCHEME &&
            _isEditing && !payerName && !payer && <span>{name}</span>}
            {payerTypeFK !== INVOICE_PAYER_TYPE.SCHEME &&
            _isEditing && payer && <span>{name} - {payer.name}</span> 
            }
            {payerTypeFK !== INVOICE_PAYER_TYPE.SCHEME &&
            _isEditing && payerName && <span>{name} - {payerName}</span> 
            }

            {_isConfirmed && !payerName && !payer && <span>{name}</span>}
            {_isConfirmed && payer && <span>{name} - {payer.name}</span>}
            {_isConfirmed && payerName && <span>{name} - {payerName}</span>}
          </span>
        </GridItem>
        {false && isMediVisit && 
        <GridItem md={2} style={{ marginTop: 8, marginBottom: 16 }}>
          {/* Medisave Visit Type [CDMP or vaccination] */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              fontWeight: 500,
              fontSize: '1rem',
              color: titleColor,
              marginRight: 20,
            }}
          >
            {disableEdit && <NotEditableInfo />}
            {payerTypeFK !== INVOICE_PAYER_TYPE.PATIENT &&
            // _isEditing && 
            (
              <Select
                style={{ width: '100%' }}
                size='sm'
                allowClear={false}
                simple
                valueField='id'
                onChange={handleVisitTypeChange}
                value={medisaveVisitType}
                disabled// ={_isConfirmed}
                options={visitTypes}
              />
            )}
            {// _isConfirmed && <div>CDMP</div>
            }
          </div>
        </GridItem>
        }
        {false && isMedisave &&
        <GridItem md={2} style={{ marginTop: 8, marginBottom: 16 }}>
          {/* Payer */}
          
          <div
            style={{
              width: '100%',
              display: 'flex',
              fontWeight: 500,
              fontSize: '1rem',
              color: titleColor,
              marginRight: 20,
            }}
          >
            {disableEdit && <NotEditableInfo />}
            {payerTypeFK !== INVOICE_PAYER_TYPE.COMPANY &&
              // _isEditing && 
              (
              <Select
                style={{ width: '100%' }}
                size='sm'
                allowClear={false}
                simple
                valueField='id'
                onChange={handleSchemePayerChange}
                value={schemePayerFK}
                disabled// ={_isConfirmed}
                options={[
                  ...payerList.map((item) => ({
                    id: item.id,
                    name: item.name,
                  })),
                ]}
              />
            )}
          </div>
        </GridItem>
        }
        {/* isMedisave && !isMediVisit && !isMediVaccination && <GridItem md={2} /> */}
        {/* isMediVaccination && medisaveVisitType === 'Vaccination' && 
        <GridItem md={2} style={{ marginTop: 8, marginBottom: 16 }}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              fontWeight: 500,
              fontSize: '1rem',
              color: titleColor,
              marginRight: 20,
            }}
          >
            {disableEdit && <NotEditableInfo />}
            {payerTypeFK !== INVOICE_PAYER_TYPE.PATIENT &&
            // _isEditing && 
            (
              <Select
                style={{ width: '100%' }}
                size='sm'
                allowClear={false}
                simple
                valueField='id'
                onChange={handleMedisaveVaccinationChange}
                value={medisaveVaccinationFK || defaultVaccination}
                disabled={_isConfirmed}
                // options={medisaveVaccinationList}            
                options={[
                  ...medisaveVaccinationLists.map((item) => ({
                      id: item.id,
                      name: item.name,
                    }
                  )),
                ]}
              />
            )}
            {// _isConfirmed && <div>Medisave Vaccination 1</div>
            }
          </div>
        </GridItem>
        */}
        {(isCHAS || isMedisave) && (
          <GridItem md={2} style={{ marginTop: 8, marginBottom: 8 }}>
            <BalanceLabel schemeConfig={schemeConfig} />
          </GridItem>
        )}
        <GridItem md={2} style={{ marginTop: 8, marginBottom: 8 }}>
          <MaxCap
            payerTypeFK={payerTypeFK}
            claimableSchemes={[
              claimableSchemes,
            ]}
            copaymentSchemeFK={copaymentSchemeFK}
            schemeConfig={schemeConfig}
          />
        </GridItem>
        <GridItem
          md={(schemeConfig && schemeConfig.copayerFK === 1) || isMedisave ? 2 : 4}
          // md={binMid}
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
                  showCommandColumn: false,
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
              disabled={
                disableEdit ||
                (isEnableAddPaymentInBilling && existingOldPayerItem)
              }
            >
              Edit
            </Button>
          )}
        </GridItem>
        {fromBilling &&
        isEnableAddPaymentInBilling && (
          <GridContainer>
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
                      printDisabled={existingOldPayerItem}
                    />
                  ))}
              </CardContainer>
            </GridItem>
            <GridItem md={7}>
              <div>
                <Button
                  {...ButtonProps}
                  disabled={shoulddisable() || existingOldPayerItem}
                  onClick={() => onAddPaymentClick(index)}
                >
                  <Add />
                  Add Payment
                </Button>
                <Button
                  {...ButtonProps}
                  disabled={shoulddisable() || existingOldPayerItem}
                  onClick={() =>
                    onPrinterClick('TaxInvoice', undefined, companyFK)}
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
        )}
      </GridContainer>
    </Paper>
  )
}

export default withStyles(styles, { name: 'Scheme' })(Scheme)
