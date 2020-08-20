import React, { Fragment, useState, useEffect, useCallback } from 'react'
import _ from 'lodash'
// material ui
import { withStyles } from '@material-ui/core'
import Add from '@material-ui/icons/AddCircle'
import Reset from '@material-ui/icons/Cached'
// common components
import {
  CommonModal,
  Button,
  GridItem,
  notification,
  WarningSnackbar,
} from '@/components'
// common utils
import { roundTo } from '@/utils/utils'
import { INVOICE_PAYER_TYPE, VISIT_TYPE } from '@/utils/constants'
// import MedisaveSchemes from './MedisaveSchemes'
import { AddPayment } from '@/components/_medisys'
import DeleteConfirmation from '@/pages/Finance/Invoice/components/modal/DeleteConfirmation'
import Scheme from './newScheme'
import ResetButton from './ResetButton'
import CoPayer from '../modal/CoPayer'
import ApplicableClaims from '../modal/ApplicableClaims'
// styles
import styles from './styles'
// utils
import {
  getInvoiceItemsWithClaimAmount,
  getCoverageAmountAndType,
  computeTotalForAllSavedClaim,
  updateOriginalInvoiceItemList,
  flattenInvoicePayersInvoiceItemList,
  validateInvoicePayerItems,
  validateClaimAmount,
  updateInvoicePayerPayableBalance,
  sortItemByID,
} from './applyClaimUtils'

const defaultInvoicePayer = {
  _indexInClaimableSchemes: 0,
  _isAppliedOnce: false,
  _isConfirmed: false,
  _isDeleted: false,
  _isEditing: true,
  _isValid: true,
  isDeleted: false,
  isCancelled: false,
  copaymentSchemeFK: undefined,
  name: '',
  payerDistributedAmt: 0,
  // claimableSchemes: claimableSchemes[0],
  invoicePayerItem: [],
  sequence: 0,
  invoicePayment: [],
  // payerTypeFK: INVOICE_PAYER_TYPE.SCHEME,
}

const ApplyClaims = ({
  dispatch,
  classes,
  values,
  setValues,
  submitCount,
  commitCount = 1,
  handleIsEditing,
  patient,
  ctschemetype,
  ctcopaymentscheme,
  onPrinterClick,
  saveBilling,
  noExtraOptions = false,
  fromBilling = false,
  handleIsExistingOldPayerItem,
  clinicSettings,
}) => {
  const {
    invoice,
    invoicePayment,
    invoicePayer: payerList,
    claimableSchemes,
    visitPurposeFK = 1,
  } = values

  const [
    showErrorPrompt,
    setShowErrorPrompt,
  ] = useState(false)

  const [
    errorMessage,
    setErrorMessage,
  ] = useState([])

  const [
    showClaimableSchemesSelection,
    setShowClaimableSchemesSelection,
  ] = useState(false)

  const [
    showCoPaymentModal,
    setShowCoPaymentModal,
  ] = useState(false)

  const [
    initialState,
    setInitialState,
  ] = useState([])

  const [
    curEditInvoicePayerBackup,
    setCurEditInvoicePayerBackup,
  ] = useState(undefined)

  const [
    tempInvoicePayer,
    setTempInvoicePayer,
  ] = useState([])

  const [
    updatedInvoiceItems,
    setUpdatedInvoiceItems,
  ] = useState([
    ...invoice.invoiceItems,
  ])

  const hasOtherEditing = tempInvoicePayer.reduce(
    (editing, payer) => payer._isEditing || editing,
    false,
  )
  const shouldDisableAddClaim =
    tempInvoicePayer.filter(
      (invoicePayer) => invoicePayer.payerTypeFK === INVOICE_PAYER_TYPE.SCHEME,
    ).length < invoice.claimableSchemes ||
    hasOtherEditing ||
    visitPurposeFK === VISIT_TYPE.RETAIL

  const incrementCommitCount = () => {
    dispatch({
      type: 'global/updateState',
      payload: { commitCount: commitCount + 1 },
    })
  }

  const updateTempInvoicePayer = (
    updatedPayer,
    updatedIndex,
    invoicePayerList,
  ) => {
    const _list = invoicePayerList || tempInvoicePayer
    const invoicePayerWithUpdatedPayer = _list.map(
      (payer, index) => (updatedIndex === index ? updatedPayer : payer),
    )
    const newInvoicePayer = updateInvoicePayerPayableBalance(
      updatedInvoiceItems,
      invoicePayerWithUpdatedPayer,
      updatedIndex,
    )
    setTempInvoicePayer(newInvoicePayer)
    incrementCommitCount()
  }

  const handleSchemeChange = (
    value,
    index,
    invoicePayerList,
    invoiceItems,
    allSchemes,
  ) => {
    const flattenSchemes = allSchemes.reduce(
      (schemes, cs) => [
        ...schemes,
        ...cs.map((item) => ({ ...item })),
      ],
      [],
    )
    const schemeConfig = flattenSchemes.find((item) => item.id === value)

    const payer = invoicePayerList
      ? invoicePayerList[index]
      : tempInvoicePayer[index]

    const payerInvoiceItems = getInvoiceItemsWithClaimAmount(
      { ...schemeConfig, claimType: payer.claimType },
      invoiceItems || updatedInvoiceItems,
      payer.invoicePayerItem,
      payer.id === undefined,
    )
    const updatedPayer = {
      ...payer,
      schemeConfig,
      name: schemeConfig.coPaymentSchemeName,
      companyFK: schemeConfig.copayerFK,
      copaymentSchemeFK: schemeConfig.id,
      isModified: true,
      invoicePayerItem: payerInvoiceItems,
    }
    updateTempInvoicePayer(updatedPayer, index, invoicePayerList || null)
  }

  const toggleCopayerModal = () => setShowCoPaymentModal(!showCoPaymentModal)

  const toggleErrorPrompt = () => {
    if (showErrorPrompt) setErrorMessage([])
    setShowErrorPrompt(!showErrorPrompt)
  }

  const syncWithQueried = () => {
    const hasAddedPayer = payerList.length > 0
    if (hasAddedPayer) {
      const mapResponseToInvoicePayers = (_payer) => {
        if (_payer.payerTypeFK === INVOICE_PAYER_TYPE.SCHEME) {
          const _claimableSchemesIndex = claimableSchemes.findIndex(
            (cs) =>
              cs.find((_cs) => _cs.id === _payer.copaymentSchemeFK) !==
              undefined,
          )

          if (claimableSchemes[_claimableSchemesIndex]) {
            const schemeConfig = claimableSchemes[_claimableSchemesIndex].find(
              (cs) => cs.id === _payer.copaymentSchemeFK,
            )

            return {
              ..._payer,
              invoicePayerItem: _payer.invoicePayerItem
                .map((item) => {
                  const { coverage } = getCoverageAmountAndType(
                    schemeConfig,
                    item,
                  )
                  // const invoiceItemTypeFK = item.invoiceItemTypeFK
                  return { ...item, coverage }
                })
                .sort(sortItemByID),
              schemeConfig,
              _indexInClaimableSchemes: _claimableSchemesIndex,

              _isConfirmed: true,
              _isDeleted: false,
              _isEditing: false,
              _isValid: true,
              claimableSchemes: claimableSchemes[_claimableSchemesIndex],
            }
          }
        }

        return {
          ..._payer,
          invoicePayerItem: _payer.invoicePayerItem.map((item) => {
            const { coverage } = getCoverageAmountAndType(null, item)
            return { ...item, coverage }
          }),
          _isConfirmed: true,
          _isDeleted: false,
          _isEditing: false,
          _isValid: true,
        }
      }
      const newInvoicePayer = payerList.map(mapResponseToInvoicePayers)
      setTempInvoicePayer(newInvoicePayer)
      setInitialState(newInvoicePayer)
    } else if (
      !invoice.isBillingSaved &&
      claimableSchemes.length > 0 &&
      invoicePayment.length === 0
    ) {
      const _invoicePayer = {
        ...defaultInvoicePayer,
        claimableSchemes: claimableSchemes[0],
        payerTypeFK: INVOICE_PAYER_TYPE.SCHEME,
      }
      setCurEditInvoicePayerBackup(_invoicePayer)
      setInitialState([
        _invoicePayer,
      ])
      handleSchemeChange(
        _invoicePayer.claimableSchemes[0].id,
        0,
        [
          _invoicePayer,
        ],
        invoice.invoiceItems,
        claimableSchemes,
      )
    } else {
      setInitialState([])
      setTempInvoicePayer([])
      setCurEditInvoicePayerBackup(undefined)
      // refTempInvociePayer.current = []
    }
  }

  const checkExistingOldPayerItem = () => {
    const { invoiceItems = [] } = invoice

    let existingOldPayerItem = false
    tempInvoicePayer.filter((tip) => !tip.isCancelled).forEach((ip) => {
      const { invoicePayerItem = [] } = ip
      if (
        invoicePayerItem.find(
          (ipi) => !invoiceItems.find((ii) => ii.id === ipi.invoiceItemFK),
        )
      ) {
        existingOldPayerItem = true
      }
    })
    return existingOldPayerItem
  }

  const updateValues = () => {
    const finalClaim = roundTo(
      tempInvoicePayer.reduce(computeTotalForAllSavedClaim, 0),
    )
    let finalPayable = roundTo(invoice.totalAftGst - finalClaim)
    const totalPaid = invoicePayment.reduce((totalAmtPaid, payment) => {
      if (!payment.isCancelled) return totalAmtPaid + payment.totalAmtPaid
      return totalAmtPaid
    }, 0)
    const newOutstandingBalance = roundTo(finalPayable - totalPaid)
    const newInvoiceItemsCopy = updateOriginalInvoiceItemList(
      invoice.invoiceItems,
      tempInvoicePayer,
    )
    setUpdatedInvoiceItems(newInvoiceItemsCopy)

    const _values = {
      ...values,
      finalClaim,
      finalPayable,
      invoice: {
        ...values.invoice,
        outstandingBalance: newOutstandingBalance,
      },
      invoicePayer: tempInvoicePayer,
    }

    handleIsEditing(hasOtherEditing)

    if (handleIsExistingOldPayerItem)
      handleIsExistingOldPayerItem(checkExistingOldPayerItem())

    setValues(_values)
  }

  const resetClaims = useCallback(
    async () => {
      const response = await dispatch({
        type: 'billing/query',
        payload: { id: values.visitId },
      })

      // abort early if failed to reset bill
      if (!response) return

      if (
        tempInvoicePayer.find((o) =>
          o.invoicePayment.find((payment) => !payment.isCancelled),
        )
      ) {
        notification.warn({
          message: 'please remove payments before reset claims',
        })
        return
      }

      const _newTempInvoicePayer = tempInvoicePayer.map((i) => ({
        ...i,
        _isDeleted: true,
        isCancelled: true,
        isModified: true,
        _isConfirmed: true,
        _isEditing: false,
      }))
      const { claimableSchemes: refreshedClaimableSchemes } = response
      if (refreshedClaimableSchemes.length > 0) {
        const _invoicePayer = {
          ...defaultInvoicePayer,
          claimableSchemes: refreshedClaimableSchemes[0],
          payerTypeFK: INVOICE_PAYER_TYPE.SCHEME,
        }
        const newTempInvoicePayer = [
          ..._newTempInvoicePayer,
          _invoicePayer,
        ]
        setCurEditInvoicePayerBackup(_invoicePayer)
        // setInitialState(newTempInvoicePayer)
        handleSchemeChange(
          _invoicePayer.claimableSchemes[0].id,
          newTempInvoicePayer.length - 1,
          newTempInvoicePayer,
          invoice.invoiceItems,
          refreshedClaimableSchemes,
        )
      } else {
        setCurEditInvoicePayerBackup(undefined)
        // setInitialState([])
        setTempInvoicePayer(_newTempInvoicePayer)
      }
    },
    [
      tempInvoicePayer,
      claimableSchemes,
      invoice.invoiceItems,
    ],
  )

  const restoreClaims = useCallback(
    () => {
      setTempInvoicePayer(initialState)
      setCurEditInvoicePayerBackup(undefined)
    },
    [
      initialState,
    ],
  )

  const handleRestoreClick = () => {
    dispatch({
      type: 'global/updateState',
      payload: {
        openConfirm: true,
        openConfirmContent:
          'Restore will restore back to last saved state. Continue?',
        openConfirmText: 'Continue',
        onConfirmSave: restoreClaims,
      },
    })
  }

  const handleResetClick = () => {
    dispatch({
      type: 'global/updateState',
      payload: {
        openConfirm: true,
        openConfirmContent:
          'Reset will revert all changes that had not been saved. Continue?',
        openConfirmText: 'Continue',
        onConfirmSave: resetClaims,
      },
    })
  }

  const handleCancelClick = useCallback(
    (index) => {
      // const isEditing = tempInvoicePayer[index].id === undefined
      const { _isAppliedOnce } = tempInvoicePayer[index]
      const isEditing = !_isAppliedOnce
      const updatedPayer = {
        ...tempInvoicePayer[index],
        ...curEditInvoicePayerBackup,
        _isConfirmed: !isEditing,
        _isEditing: isEditing,
        _isDeleted: false,
        isCancelled: false,
      }
      setCurEditInvoicePayerBackup(updatedPayer)
      updateTempInvoicePayer(updatedPayer, index)
    },
    [
      tempInvoicePayer,
    ],
  )

  const handleEditClick = useCallback(
    (index) => {
      const updatedPayer = {
        ...tempInvoicePayer[index],
        _isConfirmed: false,
        _isAppliedOnce: true,
        _isEditing: true,
        _isDeleted: false,
      }
      setCurEditInvoicePayerBackup(updatedPayer)
      updateTempInvoicePayer(updatedPayer, index)
    },
    [
      tempInvoicePayer,
    ],
  )
  const handleApplyClick = useCallback(
    (index) => {
      const invoiceItems = validateInvoicePayerItems(
        tempInvoicePayer[index].invoicePayerItem,
      )
      const hasInvalidRow = invoiceItems.reduce(
        (hasError, item) => (item.error ? true : hasError),
        false,
      )
      const updatedPayer = {
        ...tempInvoicePayer[index],
        payerDistributedAmt: roundTo(
          invoiceItems.reduce(
            (subtotal, item) => subtotal + item.claimAmount,
            0,
          ),
        ),
        payerOutstanding:
          roundTo(
            invoiceItems.reduce(
              (subtotal, item) => subtotal + item.claimAmount,
              0,
            ),
          ) - _.sum(tempInvoicePayer[index].invoicePayment, 'TotalAmtPaid'),
        isModified: true,
        invoicePayerItem: invoiceItems,
        _isConfirmed: !hasInvalidRow,
        _isEditing: hasInvalidRow,
        _isDeleted: false,
      }

      if (hasInvalidRow) {
        updateTempInvoicePayer(updatedPayer, index)
        incrementCommitCount()
        // setCommitCount(commitCount + 1)
        return false
      }
      const invalidMessages = validateClaimAmount(updatedPayer)

      if (invalidMessages.length <= 0) {
        setCurEditInvoicePayerBackup(undefined)
        updateTempInvoicePayer(updatedPayer, index)
      } else {
        setErrorMessage(invalidMessages)
        toggleErrorPrompt()
      }
      return true
    },
    [
      tempInvoicePayer,
    ],
  )

  const handleDeleteClick = useCallback(
    (index) => {
      const updatedPayer = {
        ...tempInvoicePayer[index],
        isModified: true,
        _isConfirmed: true,
        _isEditing: false,
        _isDeleted: true,
        isCancelled: true,
      }
      updateTempInvoicePayer(updatedPayer, index)
    },
    [
      tempInvoicePayer,
    ],
  )

  const handleCommitChanges = useCallback(
    ({ rows, changed }) => {
      const _id = Object.keys(changed)[0]
      let id = _id.includes('sys-gen') ? _id : parseInt(_id, 10)

      if (id === -99) return
      const index = tempInvoicePayer.findIndex((item) => item._isEditing)
      const payer = { ...tempInvoicePayer[index] }

      const changedItem = rows.find((i) => i.id === id)
      const originalItem = updatedInvoiceItems.find(
        (i) => i.id === changedItem.invoiceItemFK,
      )

      let eligibleAmount =
        originalItem.totalAfterGst - originalItem._claimedAmount
      if (eligibleAmount === 0) {
        const currentEditItemClaimedAmount = tempInvoicePayer
          .filter((_rest, i) => i !== index)
          .reduce(flattenInvoicePayersInvoiceItemList, [])
          .reduce((remainingClaimable, item) => {
            if (item.invoiceItemFK === changedItem.invoiceItemFK)
              return remainingClaimable + item.claimAmount

            return remainingClaimable
          }, 0)

        eligibleAmount =
          originalItem.totalAfterGst - currentEditItemClaimedAmount
      }

      let hasError = false
      const mapAndCompareCurrentChangesAmount = (item) => {
        if (item.id === id) {
          const currentChangesClaimAmount = changed[id].claimAmount
          if (currentChangesClaimAmount <= eligibleAmount) {
            return { ...item, error: undefined }
          }

          hasError = true
          return {
            ...item,
            error: `Cannot claim more than $${eligibleAmount.toFixed(2)}`,
          }
        }

        return { ...item, error: undefined }
      }
      const newRows = rows.map(mapAndCompareCurrentChangesAmount)
      const newInvoicePayer = {
        ...payer,
        invoicePayerItem: newRows,
        _hasError:
          rows.reduce(
            (error, row) => (row._errors && row._errors.length > 0) || error,
            false,
          ) || hasError,
        // _hasError: hasError,
      }
      updateTempInvoicePayer(newInvoicePayer, index)
      incrementCommitCount()
    },
    [
      tempInvoicePayer,
      updatedInvoiceItems,
    ],
  )

  const handleAddCoPayer = (invoicePayer) => {
    toggleCopayerModal()
    const newTempInvoicePayer = [
      ...tempInvoicePayer,
      invoicePayer,
    ]
    setTempInvoicePayer(newTempInvoicePayer)
  }

  const handleSelectClaimClick = (
    claimableSchemesIndex,
    nestedIndex,
    schemePayerFK,
  ) => {
    const invoicePayer = {
      ...defaultInvoicePayer,
      _indexInClaimableSchemes: claimableSchemesIndex,
      claimableSchemes: claimableSchemes[claimableSchemesIndex],
      payerTypeFK: INVOICE_PAYER_TYPE.SCHEME,
      schemePayerFK,
    }
    setCurEditInvoicePayerBackup(invoicePayer)
    setShowClaimableSchemesSelection(false)
    const newTempInvoicePayer = [
      ...tempInvoicePayer,
      invoicePayer,
    ]
    if (
      claimableSchemes[claimableSchemesIndex].length === 1 ||
      nestedIndex !== undefined
    ) {
      return handleSchemeChange(
        invoicePayer.claimableSchemes[nestedIndex].id,
        newTempInvoicePayer.length - 1,
        newTempInvoicePayer,
        undefined,
        claimableSchemes,
      )
    }
    return setTempInvoicePayer(newTempInvoicePayer)
  }

  const handleAddClaimClick = () => {
    setShowClaimableSchemesSelection(true)
  }

  const handleClaimTypeChange = (value, index) => {
    const claimType = value.toLowerCase()
    const updatedPayer = {
      ...tempInvoicePayer[index],
      claimType,
      invoicePayerItem: tempInvoicePayer[
        index
      ].invoicePayerItem.filter((item) => {
        if (claimType === 'vaccination' && item.invoiceItemTypeFK !== 3)
          return false
        if (claimType === 'cdmp' && item.invoiceItemTypeFK === 3) return false

        return true
      }),
    }

    updateTempInvoicePayer(updatedPayer, index)
  }

  useEffect(syncWithQueried, [
    values.id,
    submitCount,
  ])

  useEffect(updateValues, [
    tempInvoicePayer,
  ])
  const [
    showAddPaymentModal,
    setShowAddPaymentModal,
  ] = useState(false)

  const [
    selectInvoicePayer,
    setSelectInvoicePayer,
  ] = useState({})

  const [
    onVoid,
    setOnVoid,
  ] = useState({})

  const [
    showDeleteConfirmation,
    setShowDeleteConfirmation,
  ] = useState(false)

  const toggleAddPaymentModal = () => {
    setShowAddPaymentModal(!showAddPaymentModal)
  }

  const toggleDeleteConfirmation = () => {
    setShowDeleteConfirmation(!showDeleteConfirmation)
  }

  const onSubmitAddPayment = async (invoicePaymentList) => {
    toggleAddPaymentModal()
    let invoicePayer = tempInvoicePayer[selectInvoicePayer.index]
    if (invoicePayer.id && invoicePayer.id > 0) {
      invoicePayer.isModified = true
    }
    invoicePayer.invoicePayment = [
      ...(invoicePayer.invoicePayment || []),
      invoicePaymentList,
    ]
    await setTempInvoicePayer([
      ...tempInvoicePayer,
    ])
    saveBilling()
  }

  const onAddPaymentClick = async (index) => {
    let invoicePayer = tempInvoicePayer[index]
    const invoicePayerPayment = {
      ...invoice,
      payerTypeFK: invoicePayer.payerTypeFK,
      totalAftGst: invoicePayer.payerDistributedAmt,
      outstandingBalance: invoicePayer.payerOutstanding,
      finalPayable: invoicePayer.payerOutstanding,
      totalClaims: undefined,
    }

    let selectPayerName = ''
    if (invoicePayer.payerTypeFK === 1)
      selectPayerName = invoicePayer.patientName
    if (invoicePayer.payerTypeFK === 2) selectPayerName = 'Scheme'
    if (invoicePayer.payerTypeFK === 4) selectPayerName = invoicePayer.name
    await setSelectInvoicePayer({
      invoicePayerName: selectPayerName,
      index,
      invoicePayerPayment,
    })
    toggleAddPaymentModal()
  }

  const onSubmitVoid = async (cancelReason) => {
    toggleDeleteConfirmation()
    let invoicePayer = tempInvoicePayer[onVoid.payerIndex]
    invoicePayer.isModified = true
    if (onVoid.type === 'Payment') {
      let payment = invoicePayer.invoicePayment.find((o) => o.id === onVoid.id)
      payment.isCancelled = true
      payment.cancelReason = cancelReason
    }
    await setTempInvoicePayer([
      ...tempInvoicePayer,
    ])
    saveBilling()
  }
  const onPaymentVoidClick = (index, payment) => {
    setOnVoid({ payerIndex: index, ...payment })
    toggleDeleteConfirmation()
  }
  return (
    <Fragment>
      {checkExistingOldPayerItem() && (
        <GridItem md={12}>
          <div style={{ paddingLeft: 8, paddingBottom: 8 }}>
            <WarningSnackbar
              variant='warning'
              message='Invoice has been updated. Kindly remove the existing copayer/ scheme
              and re-apply again!'
            />
          </div>
        </GridItem>
      )}
      <GridItem md={2}>
        <h5 style={{ paddingLeft: 8 }}>Apply Claims</h5>
      </GridItem>
      <GridItem md={10} container justify='flex-end'>
        <Button
          color='primary'
          size='sm'
          disabled={shouldDisableAddClaim}
          onClick={handleAddClaimClick}
        >
          <Add />
          Claimable Schemes
        </Button>
        <Button
          color='primary'
          size='sm'
          onClick={toggleCopayerModal}
          disabled={hasOtherEditing}
        >
          <Add />
          Co-Payer
        </Button>
        {/* <Button color='danger' size='sm' onClick={handleResetClick}>
          <Reset />
          Reset
        </Button> */}
        {!noExtraOptions && (
          <ResetButton
            disabled={visitPurposeFK === VISIT_TYPE.RETAIL}
            handleResetClick={handleResetClick}
            handleRestoreClick={handleRestoreClick}
          />
        )}
      </GridItem>
      <GridItem md={12} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {tempInvoicePayer.map((invoicePayer, index) => {
          if (invoicePayer.isCancelled) return null
          return (
            <Scheme
              key={`invoicePayer-${index}`}
              _key={`invoicePayer-${index}`}
              invoicePayer={invoicePayer}
              index={index}
              onSchemeChange={handleSchemeChange}
              onCommitChanges={handleCommitChanges}
              onCancelClick={handleCancelClick}
              onEditClick={handleEditClick}
              onApplyClick={handleApplyClick}
              onDeleteClick={handleDeleteClick}
              hasOtherEditing={hasOtherEditing}
              patient={patient}
              ctschemetype={ctschemetype}
              ctcopaymentscheme={ctcopaymentscheme}
              onPaymentVoidClick={onPaymentVoidClick}
              onPrinterClick={onPrinterClick}
              onAddPaymentClick={onAddPaymentClick}
              fromBilling={fromBilling}
              invoice={invoice}
              clinicSettings={clinicSettings}
            />
          )
        })}
      </GridItem>
      <CommonModal
        title='Claim Amount Check'
        open={showErrorPrompt}
        onClose={toggleErrorPrompt}
        maxWidth='sm'
      >
        <div className={classes.errorPromptContainer}>
          {errorMessage.map((message) => <p>{message}</p>)}
        </div>
      </CommonModal>
      <CommonModal
        title='Add Copayer'
        open={showCoPaymentModal}
        onClose={toggleCopayerModal}
      >
        <CoPayer
          onAddCoPayerClick={handleAddCoPayer}
          copayers={tempInvoicePayer
            .filter(
              (payer) =>
                !payer.isCancelled &&
                payer.payerTypeFK === INVOICE_PAYER_TYPE.COMPANY,
            )
            .map((i) => i.companyFK)}
          invoiceItems={updatedInvoiceItems.map((invoiceItem) => ({
            ...invoiceItem,
            itemName: invoiceItem.itemDescription,
            schemeCoverage: 100,
            schemeCoverageType: 'Percentage',
            payableBalance:
              invoiceItem.totalAfterGst - (invoiceItem._claimedAmount || 0),
          }))}
        />
      </CommonModal>
      <CommonModal
        open={showClaimableSchemesSelection}
        title='Claimable Schemes'
        onClose={() =>
          setShowClaimableSchemesSelection(!showClaimableSchemesSelection)}
        maxWidth='sm'
      >
        <ApplicableClaims
          currentClaims={tempInvoicePayer
            .filter(
              (invoicePayer) =>
                !invoicePayer.isCancelled &&
                invoicePayer.payerTypeFK === INVOICE_PAYER_TYPE.SCHEME &&
                !_.isEmpty(invoicePayer.schemeConfig),
            )
            .map((i) => i.schemeConfig.id)}
          claimableSchemes={claimableSchemes}
          handleSelectClick={handleSelectClaimClick}
        />
      </CommonModal>
      <CommonModal
        open={showAddPaymentModal}
        title='Add Payment'
        onClose={toggleAddPaymentModal}
        observe='AddPaymentForm'
        maxWidth='lg'
      >
        <AddPayment
          handleSubmit={onSubmitAddPayment}
          onClose={toggleAddPaymentModal}
          invoicePayerName={selectInvoicePayer.invoicePayerName}
          invoicePayment={[]}
          showPaymentDate
          invoice={{
            ...selectInvoicePayer.invoicePayerPayment,
          }}
        />
      </CommonModal>
      <CommonModal
        open={showDeleteConfirmation}
        title={`Void ${onVoid.type}`}
        onConfirm={toggleDeleteConfirmation}
        onClose={toggleDeleteConfirmation}
        maxWidth='sm'
      >
        <DeleteConfirmation handleSubmit={onSubmitVoid} {...onVoid} />
      </CommonModal>
    </Fragment>
  )
}

export default withStyles(styles, { name: 'NewApplyClaims' })(ApplyClaims)
