import React, { Fragment, useState, useEffect, useCallback } from 'react'
import _ from 'lodash'
// material ui
import { withStyles } from '@material-ui/core'
import Add from '@material-ui/icons/AddCircle'
// common components
import {
  CommonModal,
  Button,
  GridItem,
  WarningSnackbar,
  Tooltip,
} from '@/components'
// common utils
import { roundTo } from '@/utils/utils'
import {
  INVOICE_PAYER_TYPE,
  VISIT_TYPE,
  COPAYER_TYPE,
  SCHEME_CATEGORY,
} from '@/utils/constants'
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
  payerDistributedAmtBeforeGST: 0,
  invoicePayerItem: [],
  sequence: 0,
  invoicePayment: [],
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
  ctcopayer,
  ctservice,
  onPrinterClick,
  saveBilling,
  noExtraOptions = false,
  fromBilling = false,
  handleUpdatedAppliedInvoicePayerInfo,
  clinicSettings = {},
  showRefreshOrder,
}) => {
  const {
    invoice,
    invoicePayment,
    invoicePayer: payerList,
    claimableSchemes,
    visitPurposeFK = 1,
  } = values

  const [showErrorPrompt, setShowErrorPrompt] = useState(false)

  const [errorMessage, setErrorMessage] = useState([])

  const [
    showClaimableSchemesSelection,
    setShowClaimableSchemesSelection,
  ] = useState(false)

  const [showCoPaymentModal, setShowCoPaymentModal] = useState(false)

  const [initialState, setInitialState] = useState([])

  const [curEditInvoicePayerBackup, setCurEditInvoicePayerBackup] = useState(
    undefined,
  )

  const [tempInvoicePayer, setTempInvoicePayer] = useState([])

  const [updatedInvoiceItems, setUpdatedInvoiceItems] = useState([
    ...invoice.invoiceItems,
  ])

  const hasOtherEditing = tempInvoicePayer.reduce(
    (editing, payer) => payer._isEditing || editing,
    false,
  )

  const shouldDisableAddClaim =
    tempInvoicePayer.filter(
      invoicePayer =>
        invoicePayer.payerTypeFK === INVOICE_PAYER_TYPE.SCHEME ||
        invoicePayer.payerTypeFK === INVOICE_PAYER_TYPE.PAYERACCOUNT,
    ).length < invoice.claimableSchemes ||
    hasOtherEditing ||
    visitPurposeFK === VISIT_TYPE.OTC

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
    autoApply = false,
    newInvoicePayers,
  ) => {
    const _list = invoicePayerList || tempInvoicePayer
    const invoicePayerWithUpdatedPayer = _list.map((payer, index) =>
      updatedIndex === index ? updatedPayer : payer,
    )
    const newInvoicePayer = updateInvoicePayerPayableBalance(
      updatedInvoiceItems,
      invoicePayerWithUpdatedPayer,
      updatedIndex,
      autoApply,
      invoice.gstValue || 0,
      invoice,
    )

    const newInvoicePayerAmt = newInvoicePayer.reduce((list, n) => {
      const newItems = n.invoicePayerItem
      list.push({
        ...n,
        invoicePayerItem: newItems,
      })
      return list
    }, [])

    const newInvoicePayerFilled = newInvoicePayers
      ? newInvoicePayerAmt.filter(o => o.copaymentSchemeFK)
      : []
    let newInvoicePayerList = []
    if (newInvoicePayers) {
      let payerIDs = newInvoicePayers.map(o => o._indexInClaimableSchemes)
      newInvoicePayerFilled.forEach(n => {
        // insert if absent
        if (payerIDs.indexOf(n._indexInClaimableSchemes) >= 0)
          newInvoicePayerList = [...newInvoicePayers]
        else
          newInvoicePayerList = [...newInvoicePayers, ...newInvoicePayerFilled]
      })
    }

    const returnInvoicePayers = newInvoicePayers
      ? newInvoicePayerList
      : newInvoicePayerAmt // end up replacing list
    setTempInvoicePayer(returnInvoicePayers || [])
    incrementCommitCount()
    return returnInvoicePayers
  }

  const handleSchemeChange = (
    value,
    index,
    invoicePayerList,
    invoiceItems,
    allSchemes,
    autoApply = false,
    newInvoicePayers,
  ) => {
    const flattenSchemes = allSchemes.reduce(
      (schemes, cs) => [...schemes, ...cs.map(item => ({ ...item }))],
      [],
    )

    const payer = invoicePayerList
      ? invoicePayerList[index]
      : tempInvoicePayer[index]

    const schemeConfig = flattenSchemes.find(
      item => item.id === value && payer.schemePayerFK === item.schemePayerFK,
    )

    const midPayer = {
      ...payer,
      schemeConfig,
      name: schemeConfig.coPaymentSchemeName,
      companyFK: schemeConfig.copayerFK,
      copaymentSchemeFK: payer.copaymentSchemeFK || schemeConfig.id,
      isModified: true,
    }

    const tempInvoiceItems = invoiceItems || updatedInvoiceItems
    let newVisitType = null
    const copaymentSchemeCode = ctcopaymentscheme.find(
      cps => cps.id === midPayer.copaymentSchemeFK,
    )?.code
    const payerInvoiceItems = getInvoiceItemsWithClaimAmount(
      { ...schemeConfig, claimType: payer.claimType },
      invoiceItems || updatedInvoiceItems,
      payer.invoicePayerItem,
      payer.id === undefined,
      null,
    )

    const totalClaimed = payerInvoiceItems.reduce((oldTotal, newTotal) => {
      return oldTotal + newTotal.claimAmountBeforeGST
    }, 0)
    const updatedPayer =
      payerInvoiceItems.length > 0 && totalClaimed > 0
        ? {
            ...midPayer,
            schemeConfig,
            invoicePayerItem: payerInvoiceItems,
          }
        : null
    const newInvoicePayer = updatedPayer
      ? updateTempInvoicePayer(
          updatedPayer,
          index,
          invoicePayerList || null,
          autoApply,
          newInvoicePayers,
        )
      : null

    return newInvoicePayer || newInvoicePayers
  }

  const toggleCopayerModal = () => setShowCoPaymentModal(!showCoPaymentModal)

  const toggleErrorPrompt = () => {
    if (showErrorPrompt) setErrorMessage([])
    setShowErrorPrompt(!showErrorPrompt)
  }

  const getPayerType = scheme => {
    const isCorporate =
      [SCHEME_CATEGORY.CORPORATE, SCHEME_CATEGORY.INSURANCE].indexOf(
        scheme.schemeCategoryFK,
      ) >= 0
    if (isCorporate) return INVOICE_PAYER_TYPE.COMPANY
  }

  const handleSelectClaimClick = (
    claimableSchemesIndex,
    nestedIndex,
    claimableSchemesFK,
    schemePayer,
  ) => {
    const scheme = ctcopaymentscheme.find(c => c.id === claimableSchemesFK)
    const invoicePayer = {
      ...defaultInvoicePayer,
      _indexInClaimableSchemes: claimableSchemesIndex,
      claimableSchemes: claimableSchemes[claimableSchemesIndex],
      payerTypeFK: getPayerType(scheme),
      schemePayerFK: schemePayer,
    }

    setCurEditInvoicePayerBackup(invoicePayer)
    setShowClaimableSchemesSelection(false)
    const newTempInvoicePayer = [...tempInvoicePayer, invoicePayer]
    if (
      claimableSchemes[claimableSchemesIndex].length === 1 ||
      nestedIndex !== undefined
    ) {
      const newInvoicePayers = handleSchemeChange(
        invoicePayer.claimableSchemes[nestedIndex].id,
        newTempInvoicePayer.length - 1,
        newTempInvoicePayer,
        undefined,
        claimableSchemes,
      )

      setInitialState(newInvoicePayers)
      return newInvoicePayers
    }
    return setTempInvoicePayer(newTempInvoicePayer || [])
  }

  const checkUpdatedAppliedInvoicePayerInfo = () => {
    let isUpdatedAppliedInvoicePayerInfo
    const { invoiceItems = [] } = invoice
    const activeInvoicePayer = tempInvoicePayer.filter(tip => !tip.isCancelled)

    invoiceItems.forEach(item => {
      for (let index = 0; index < activeInvoicePayer.length; index++) {
        const { invoicePayerItem = [] } = activeInvoicePayer[index]
        const payerItem = invoicePayerItem.find(
          ipi => item.id === ipi.invoiceItemFK,
        )
        if (payerItem) {
          if (item.totalBeforeGst !== payerItem.payableBalance) {
            isUpdatedAppliedInvoicePayerInfo = true
          }
          break
        }
      }
    })
    return isUpdatedAppliedInvoicePayerInfo
  }

  const updateInvoiceItems = async newInvoiceItemsCopy => {
    await setUpdatedInvoiceItems(newInvoiceItemsCopy)
  }

  const updateValues = newInvoicePayers => {
    const temp = newInvoicePayers || tempInvoicePayer
    const finalClaim = roundTo(temp.reduce(computeTotalForAllSavedClaim, 0))
    let finalPayable = roundTo(invoice.totalAftGst - finalClaim)
    const totalPaid = invoicePayment.reduce((totalAmtPaid, payment) => {
      if (!payment.isCancelled) return totalAmtPaid + payment.totalAmtPaid
      return totalAmtPaid
    }, 0)
    const newOutstandingBalance = roundTo(finalPayable - totalPaid)
    const newInvoiceItemsCopy = updateOriginalInvoiceItemList(
      invoice.invoiceItems.filter(item => !item.hasPaid),
      temp,
    )
    updateInvoiceItems(newInvoiceItemsCopy)

    const _values = {
      ...values,
      finalClaim,
      finalPayable,
      invoice: {
        ...values.invoice,
        outstandingBalance: newOutstandingBalance,
      },
      invoicePayer: temp,
    }

    handleIsEditing(hasOtherEditing)

    if (handleUpdatedAppliedInvoicePayerInfo)
      handleUpdatedAppliedInvoicePayerInfo(
        checkUpdatedAppliedInvoicePayerInfo(),
      )

    setValues(_values)
  }

  const getInvoiceItemsForClaim = newInvoicePayers => {
    const temp = newInvoicePayers || tempInvoicePayer
    const finalClaim = roundTo(temp.reduce(computeTotalForAllSavedClaim, 0))
    let finalPayable = roundTo(invoice.totalAftGst - finalClaim)
    const totalPaid = invoicePayment.reduce((totalAmtPaid, payment) => {
      if (!payment.isCancelled) return totalAmtPaid + payment.totalAmtPaid
      return totalAmtPaid
    }, 0)
    const newOutstandingBalance = roundTo(finalPayable - totalPaid)
    const newInvoiceItemsCopy = updateOriginalInvoiceItemList(
      invoice.invoiceItems.filter(item => !item.hasPaid),
      temp,
    )

    return newInvoiceItemsCopy
  }

  const processAvailableClaims = (newInvoicePayer, _invoicePayers) => {
    let newInvoicePayers = null
    if (_invoicePayers.length > 0) {
      _invoicePayers.forEach(invoicePayer => {
        updateValues(newInvoicePayers)

        const newItems = getInvoiceItemsForClaim(newInvoicePayers)
        if (
          newItems &&
          newItems.filter(item => {
            return item._claimedAmount >= item.totalBeforeGst
          }).length >= newItems.length
        )
          return true
        newInvoicePayers = handleSchemeChange(
          invoicePayer.claimableSchemes[0].id,
          0,
          [invoicePayer],
          newItems,
          claimableSchemes,
          true,
          newInvoicePayers,
        )
        return false
      })
    }
    return newInvoicePayers
  }

  const constructAvailableClaims = claimableSchemesList => {
    let invoicePayerList = []

    claimableSchemesList.forEach((s, index) => {
      const invoicePayer = {
        ...defaultInvoicePayer,
        claimableSchemes: [s[0]],
        payerTypeFK: getPayerType(s[0]),
        schemePayerFK: s[0].schemePayerFK,
      }

      invoicePayerList.push({
        ...invoicePayer,
        _indexInClaimableSchemes: index,
      })
    })

    return invoicePayerList
  }

  const syncWithQueried = () => {
    const hasAddedPayer = payerList.length > 0
    if (hasAddedPayer) {
      const mapResponseToInvoicePayers = _payer => {
        if (_payer.payerTypeFK !== INVOICE_PAYER_TYPE.COMPANY) {
          const _claimableSchemesIndex = claimableSchemes.findIndex(
            cs =>
              cs.find(_cs => _cs.id === _payer.copaymentSchemeFK) !== undefined,
          )

          if (claimableSchemes[_claimableSchemesIndex]) {
            const schemeConfig = claimableSchemes[_claimableSchemesIndex].find(
              cs => cs.id === _payer.copaymentSchemeFK,
            )

            return {
              ..._payer,
              invoicePayerItem: _payer.invoicePayerItem
                .map(item => {
                  const { coverage } = getCoverageAmountAndType(
                    schemeConfig,
                    item,
                  )
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
          invoicePayerItem: _payer.invoicePayerItem.map(item => {
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
      setTempInvoicePayer(newInvoicePayer || [])
      setInitialState(newInvoicePayer)
    } else if (
      !invoice.isBillingSaved &&
      claimableSchemes.length > 0 &&
      invoicePayment.filter(o => !o.isCancelled).length === 0
    ) {
      if (claimableSchemes.length > 0) {
        const invoicePayerList = constructAvailableClaims(
          claimableSchemes.filter(c => !c[0].schemePayerFK),
        )
        const newInvoicePayers = processAvailableClaims([], invoicePayerList)
        setInitialState(newInvoicePayers)
        setTempInvoicePayer(newInvoicePayers || [])
      }
    } else {
      setInitialState([])
      setTempInvoicePayer([])
      setCurEditInvoicePayerBackup(undefined)
    }
  }

  const resetClaims = useCallback(async () => {
    const response = await dispatch({
      type: 'billing/query',
      payload: { id: values.visitId },
    })

    // abort early if failed to reset bill
    if (!response) return

    const _newTempInvoicePayer = tempInvoicePayer.map(i => ({
      ...i,
      _isDeleted: true,
      isCancelled: true,
      isModified: true,
      _isConfirmed: true,
      _isEditing: false,
    }))
    const { claimableSchemes: refreshedClaimableSchemes } = response
    if (refreshedClaimableSchemes.length > 0) {
      const invoicePayerList = constructAvailableClaims(
        refreshedClaimableSchemes.filter(c => !c[0].schemePayerFK),
      )
      const newInvoicePayers = processAvailableClaims([], invoicePayerList)
      setInitialState(newInvoicePayers)
      setTempInvoicePayer(newInvoicePayers || [])
    } else {
      setCurEditInvoicePayerBackup(undefined)
      setTempInvoicePayer(_newTempInvoicePayer || [])
    }
  }, [tempInvoicePayer, claimableSchemes, invoice.invoiceItems])

  const restoreClaims = useCallback(() => {
    setTempInvoicePayer(initialState)
    setCurEditInvoicePayerBackup(undefined)
  }, [initialState])

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
    index => {
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
    [tempInvoicePayer],
  )

  const handleEditClick = useCallback(
    index => {
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
    [tempInvoicePayer],
  )
  const handleApplyClick = useCallback(
    index => {
      const invoiceItems = validateInvoicePayerItems(
        tempInvoicePayer[index].invoicePayerItem,
      )
      const hasInvalidRow = invoiceItems.reduce(
        (hasError, item) => (item.error ? true : hasError),
        false,
      )

      const total = roundTo(
        invoiceItems.reduce(
          (total, item) => total + item.claimAmountBeforeGST,
          0,
        ),
      )
      let gstAmount = roundTo((total * (invoice.gstValue || 0)) / 100)

      const isFullyClaimed =
        _.sumBy(
          tempInvoicePayer.filter(t => !t.isCancelled),
          'payerDistributedAmtBeforeGST',
        ) === invoice.totalAftAdj

      // make sure the total gst of invoice payer will not over than invoice gst.
      if (index === tempInvoicePayer.length - 1 && isFullyClaimed) {
        const otherPayerGST =
          _.sumBy(
            tempInvoicePayer.filter(t => t.isCancelled),
            t => t.gstAmount,
          ) - tempInvoicePayer[index].gstAmount
        gstAmount = invoice.gstAmount - otherPayerGST
      }

      const updatedPayer = {
        ...tempInvoicePayer[index],
        payerDistributedAmtBeforeGST: total,
        gstAmount: gstAmount,
        payerDistributedAmt: total + gstAmount,
        payerOutstanding:
          total +
          gstAmount -
          _.sumBy(
            (tempInvoicePayer[index].invoicePayment || []).filter(
              p => !p.isCancelled,
            ),
            'totalAmtPaid',
          ),
        isModified: true,
        invoicePayerItem: invoiceItems,
        _isConfirmed: !hasInvalidRow,
        _isEditing: hasInvalidRow,
        _isDeleted: false,
      }

      if (hasInvalidRow) {
        updateTempInvoicePayer(updatedPayer, index)
        incrementCommitCount()
        return false
      }
      const invalidMessages = validateClaimAmount(
        updatedPayer,
        tempInvoicePayer,
      )

      if (invalidMessages.length <= 0) {
        setCurEditInvoicePayerBackup(undefined)
        updateTempInvoicePayer(updatedPayer, index)
      } else {
        setErrorMessage(invalidMessages)
        toggleErrorPrompt()
      }
      return true
    },
    [tempInvoicePayer],
  )

  const handleDeleteClick = useCallback(
    index => {
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
    [tempInvoicePayer],
  )

  const handleCommitChanges = useCallback(
    ({ rows, changed }) => {
      const _id = Object.keys(changed)[0]
      let id = _id.includes('sys-gen') ? _id : parseInt(_id, 10)

      if (id === -99) return
      const index = tempInvoicePayer.findIndex(item => item._isEditing)
      const payer = { ...tempInvoicePayer[index] }

      const changedItem = rows.find(i => i.id === id)
      const originalItem = updatedInvoiceItems.find(
        i => i.id === changedItem.invoiceItemFK,
      )

      let eligibleAmount =
        originalItem.totalBeforeGst - originalItem._claimedAmount
      if (eligibleAmount === 0) {
        const currentEditItemClaimedAmount = tempInvoicePayer
          .filter((_rest, i) => i !== index)
          .reduce(flattenInvoicePayersInvoiceItemList, [])
          .reduce((remainingClaimable, item) => {
            if (item.invoiceItemFK === changedItem.invoiceItemFK)
              return remainingClaimable + item.claimAmountBeforeGST

            return remainingClaimable
          }, 0)

        eligibleAmount =
          originalItem.totalBeforeGst - currentEditItemClaimedAmount
      }

      let hasError = false
      const mapAndCompareCurrentChangesAmount = item => {
        if (item.id === id) {
          const currentChangesClaimAmount = changed[id].claimAmountBeforeGST
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
      }
      updateTempInvoicePayer(newInvoicePayer, index)
      incrementCommitCount()
    },
    [tempInvoicePayer, updatedInvoiceItems],
  )

  const handleAddCoPayer = invoicePayer => {
    toggleCopayerModal()
    const newTempInvoicePayer = [...tempInvoicePayer, invoicePayer]

    // recalculate GST
    newTempInvoicePayer.forEach(payer => {
      payer.gstAmount = roundTo(
        (payer.payerDistributedAmtBeforeGST * invoice.gstValue) / 100,
      )
    })

    const isFullyClaimed =
      _.sumBy(
        newTempInvoicePayer.filter(t => !t.isCancelled),
        'payerDistributedAmtBeforeGST',
      ) === invoice.totalAftAdj
    if (isFullyClaimed) {
      _.last(newTempInvoicePayer.filter(x => !x.isCancelled)).gstAmount =
        invoice.gstAmount -
        _.sumBy(
          tempInvoicePayer.filter(x => !x.isCancelled),
          'gstAmount',
        )
    }
    newTempInvoicePayer.forEach(payer => {
      if (!payer.isCancelled) {
        payer.payerOutstanding =
          payer.payerDistributedAmtBeforeGST + payer.gstAmount
        payer.payerDistributedAmt =
          payer.payerDistributedAmtBeforeGST + payer.gstAmount
      }
    })

    setTempInvoicePayer([...tempInvoicePayer, invoicePayer])
  }

  const handleAddClaimClick = () => {
    setShowClaimableSchemesSelection(true)
  }

  useEffect(syncWithQueried, [values.id, submitCount])
  useEffect(updateValues, [tempInvoicePayer])
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)

  const [selectInvoicePayer, setSelectInvoicePayer] = useState({})

  const [onVoid, setOnVoid] = useState({})

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const toggleAddPaymentModal = () => {
    setShowAddPaymentModal(!showAddPaymentModal)
  }

  const toggleDeleteConfirmation = () => {
    setShowDeleteConfirmation(!showDeleteConfirmation)
  }

  const onSubmitAddPayment = async invoicePaymentList => {
    toggleAddPaymentModal()
    let invoicePayer = tempInvoicePayer[selectInvoicePayer.index]
    if (invoicePayer.id && invoicePayer.id > 0) {
      invoicePayer.isModified = true
    }
    invoicePayer.invoicePayment = [
      ...(invoicePayer.invoicePayment || []),
      invoicePaymentList,
    ]
    await setTempInvoicePayer([...tempInvoicePayer])
    saveBilling()
  }

  const onAddPaymentClick = async index => {
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

  const onSubmitVoid = async cancelReason => {
    toggleDeleteConfirmation()
    let invoicePayer = tempInvoicePayer[onVoid.payerIndex]
    invoicePayer.isModified = true
    if (onVoid.type === 'Payment') {
      let payment = invoicePayer.invoicePayment.find(o => o.id === onVoid.id)
      payment.isCancelled = true
      payment.cancelReason = cancelReason
    }
    await setTempInvoicePayer([...tempInvoicePayer])
    saveBilling()
  }
  const onPaymentVoidClick = (index, payment) => {
    setOnVoid({ payerIndex: index, ...payment })
    toggleDeleteConfirmation()
  }

  const ClearAllInvoicePayer = () => {
    setTempInvoicePayer([
      ...tempInvoicePayer.map(payer => {
        if (payer.isCancelled) return payer
        return {
          ...payer,
          isCancelled: true,
          isModified: true,
        }
      }),
    ])
  }

  const cancelEdittingInvoicePayer = () => {
    setTempInvoicePayer([
      ...tempInvoicePayer.map(payer => {
        if (payer.isCancelled || !payer._isEditing) return payer
        return {
          ...payer,
          _isConfirmed: true,
          _isEditing: false,
        }
      }),
    ])
  }
  if (
    showRefreshOrder &&
    tempInvoicePayer.find(payer => !payer.isCancelled && payer._isEditing)
  ) {
    cancelEdittingInvoicePayer()
  }

  return (
    <Fragment>
      {checkUpdatedAppliedInvoicePayerInfo() && (
        <GridItem md={12}>
          <div style={{ paddingBottom: 8 }}>
            <WarningSnackbar
              variant='warning'
              message='Invoice has been updated. Kindly remove the payment(s) made for existing copayer/scheme and click CLEAR ALL to continue.'
            />
            <div
              style={{
                float: 'right',
                right: 0,
                alignItems: 'center',
                position: 'relative',
                bottom: 36,
                marginBottom: -36,
              }}
            >
              <Tooltip title='Click to remove all Co-Payers'>
                <Button
                  color='danger'
                  size='sm'
                  disabled={
                    tempInvoicePayer.find(
                      payer =>
                        !payer.isCancelled &&
                        (payer.invoicePayment || []).find(
                          payment => !payment.isCancelled,
                        ),
                    ) || showRefreshOrder
                  }
                  onClick={ClearAllInvoicePayer}
                >
                  Clear All
                </Button>
              </Tooltip>
            </div>
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
          disabled={
            shouldDisableAddClaim ||
            checkUpdatedAppliedInvoicePayerInfo() ||
            showRefreshOrder
          }
          onClick={handleAddClaimClick}
        >
          <Add />
          Claimable Schemes
        </Button>
        <Button
          color='primary'
          size='sm'
          onClick={toggleCopayerModal}
          disabled={
            hasOtherEditing ||
            checkUpdatedAppliedInvoicePayerInfo() ||
            showRefreshOrder
          }
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
            disabled={
              visitPurposeFK === VISIT_TYPE.OTC ||
              tempInvoicePayer.find(
                payer =>
                  !payer.isCancelled &&
                  (payer.invoicePayment || []).find(
                    payment => !payment.isCancelled,
                  ),
              ) ||
              checkUpdatedAppliedInvoicePayerInfo() ||
              showRefreshOrder
            }
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
              tempInvoicePayer={tempInvoicePayer}
              isUpdatedAppliedInvoicePayerInfo={checkUpdatedAppliedInvoicePayerInfo()}
              showRefreshOrder={showRefreshOrder}
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
          {errorMessage.map(message => (
            <p>{message}</p>
          ))}
        </div>
      </CommonModal>
      <CommonModal
        title='Add Co-Payer'
        open={showCoPaymentModal}
        onClose={toggleCopayerModal}
      >
        <CoPayer
          onAddCoPayerClick={handleAddCoPayer}
          copayers={tempInvoicePayer
            .filter(
              payer =>
                !payer.isCancelled &&
                payer.payerTypeFK === INVOICE_PAYER_TYPE.COMPANY &&
                !payer.copaymentSchemeFK,
            )
            .map(i => i.companyFK)}
          invoiceItems={updatedInvoiceItems.map(invoiceItem => ({
            ...invoiceItem,
            itemName: invoiceItem.itemDescription,
            schemeCoverage: 100,
            schemeCoverageType: 'Percentage',
            payableBalance: roundTo(
              invoiceItem.totalBeforeGst - (invoiceItem._claimedAmount || 0),
            ),
          }))}
          invoice={invoice}
        />
      </CommonModal>
      <CommonModal
        open={showClaimableSchemesSelection}
        title='Claimable Schemes'
        onClose={() =>
          setShowClaimableSchemesSelection(!showClaimableSchemesSelection)
        }
        maxWidth='sm'
      >
        <ApplicableClaims
          currentClaims={tempInvoicePayer.filter(invoicePayer => {
            return (
              !invoicePayer.isCancelled && !_.isEmpty(invoicePayer.schemeConfig)
            )
          })}
          claimableSchemes={claimableSchemes}
          handleSelectClick={handleSelectClaimClick}
          schemePayer={patient.schemePayer}
          ctschemetype={ctschemetype}
          ctcopaymentscheme={ctcopaymentscheme}
          invoiceItems={updatedInvoiceItems}
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
