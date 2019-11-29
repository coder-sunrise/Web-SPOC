import React, { useEffect, useCallback, useState, useRef } from 'react'
// material ui
import { Paper, withStyles } from '@material-ui/core'
import Add from '@material-ui/icons/AddCircle'
import Reset from '@material-ui/icons/Cached'
// common components
import {
  Button,
  CommonModal,
  CommonTableGrid,
  GridContainer,
  GridItem,
  NumberInput,
  Select,
} from '@/components'
// sub components
import MaxCapInfo from './MaxCapInfo'
import DeleteWithPopover from './DeleteWithPopover'
// page modal
import ApplicableClaims from '../modal/ApplicableClaims'
import CoPayer from '../modal/CoPayer'
import {
  SchemeInvoicePayerColumn,
  CompanyInvoicePayerColumn,
  ApplyClaimsColumnExtension,
} from '../variables'
// constants
import {
  flattenInvoicePayersInvoiceItemList,
  computeInvoiceItemSubtotal,
  computeTotalForAllSavedClaim,
  getCoverageAmountAndType,
  getApplicableClaimAmount,
  validateClaimAmount,
  validateInvoicePayerItems,
} from '../utils'
import {
  INVOICE_PAYER_TYPE,
  INVOICE_ITEM_TYPE_BY_TEXT,
} from '@/utils/constants'
import { roundTo } from '@/utils/utils'

const styles = (theme) => ({
  gridRow: {
    margin: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,

    '& > h5': {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
    },
  },
  gridActionBtn: {
    textAlign: 'right',
    marginTop: theme.spacing(1),
  },
  rightEndBtn: {
    marginRight: 0,
  },
  dangerText: {
    fontWeight: 500,
    color: '#cf1322',
  },
  currencyText: {
    fontWeight: 500,
    color: 'darkblue',
  },
  errorPromptContainer: {
    textAlign: 'center',
    '& p': {
      fontSize: '1rem',
    },
  },
})

const ApplyClaims = ({
  classes,
  dispatch,
  values,
  setValues,
  submitCount,
  handleIsEditing,
  onResetClick,
}) => {
  const { invoice, invoicePayment, claimableSchemes } = values

  const [
    showErrorPrompt,
    setShowErrorPrompt,
  ] = useState(false)

  const [
    errorMessage,
    setErrorMessage,
  ] = useState([])

  const [
    initialState,
    setInitialState,
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
    tempInvoicePayer,
    setTempInvoicePayer,
  ] = useState([])

  let refTempInvociePayer = useRef(tempInvoicePayer)

  const [
    curEditInvoicePayerBackup,
    setCurEditInvoicePayerBackup,
  ] = useState(undefined)

  const hasEditing = () =>
    tempInvoicePayer.reduce(
      (disbleAddClaim, item) => (item._isEditing ? true : disbleAddClaim),
      false,
    )

  const getInvoiceItems = (
    // schemeID,
    scheme,
    oriInvoiceItems,
    curInvoiceItems,
    // index,
  ) => {
    if (!scheme && !oriInvoiceItems) return []
    const _invoiceItems = oriInvoiceItems.reduce((newList, item) => {
      if (item.notClaimableBySchemeIds.includes(scheme.id))
        return [
          ...newList,
        ]
      const existed = curInvoiceItems.find((curItem) => curItem.id === item.id)

      let {
        coverage, // for display purpose only, value will be $100 or 100%
        schemeCoverage, // for sending to backend
        schemeCoverageType, // for sending to backend
      } = getCoverageAmountAndType(scheme, item)

      // const invoiceItemTypeFK = item.invoiceItemTypeFk
      //   ? item.invoiceItemTypeFk
      //   : item.invoiceItemTypeFK
      const { invoiceItemTypeFK } = item
      if (existed)
        return [
          ...newList,
          {
            ...existed,
            coverage,
            schemeCoverageType,
            schemeCoverage,
            itemName: existed.itemDescription,
          },
        ]

      return [
        ...newList,
        {
          ...item,
          invoiceItemTypeFK,
          payableBalance: item.totalAfterGst,
          coverage,
          schemeCoverageType,
          schemeCoverage,
          itemName: item.itemDescription,
        },
      ]
    }, [])

    return [
      ..._invoiceItems,
    ]
  }

  const updateOriginalInvoiceItemList = () => {
    const _resultInvoiceItems = invoice.invoiceItems.map((item) => {
      const computeInvoicePayerSubtotal = (subtotal, invoicePayer) => {
        if (invoicePayer.isCancelled) return roundTo(subtotal)
        const _invoicePayerItem = invoicePayer.invoicePayerItem.find(
          (payerItem) =>
            payerItem.invoiceItemFK
              ? payerItem.invoiceItemFK === item.id
              : payerItem.id === item.id,
        )

        if (_invoicePayerItem) {
          return roundTo(subtotal + _invoicePayerItem.claimAmount)
        }
        return roundTo(subtotal)
      }
      const _subtotal = tempInvoicePayer.reduce(computeInvoicePayerSubtotal, 0)
      return { ...item, _claimedAmount: _subtotal }
    })

    return _resultInvoiceItems
  }

  const _updateTempInvoicePayer = (updatedIndex, updatedRow) => {
    const _invoicePayersWithUpdatedClaimRow = refTempInvociePayer.current.map(
      (item, oriIndex) =>
        updatedIndex === oriIndex ? { ...updatedRow } : { ...item },
    )

    const _newTempInvoicePayer = _invoicePayersWithUpdatedClaimRow.reduce(
      (_newInvoicePayers, invoicePayer, curIndex) => {
        if (invoicePayer.isCancelled) {
          return [
            ..._newInvoicePayers,
            invoicePayer,
          ]
        }

        if (curIndex === 0) {
          return [
            ..._newInvoicePayers,
            {
              ...invoicePayer,
              invoicePayerItem: invoicePayer.invoicePayerItem.map((item) => {
                const original = invoice.invoiceItems.find(
                  (originalItem) =>
                    invoicePayer.id
                      ? originalItem.id === item.invoiceItemFK
                      : originalItem.id === item.id,
                )
                return { ...item, payableBalance: original.totalAfterGst }
              }),
            },
          ]
        }

        if (curIndex < updatedIndex)
          return [
            ..._newInvoicePayers,
            invoicePayer,
          ]

        const previousIndexesInvoiceItems = _newInvoicePayers
          .filter((payer) => !payer.isCancelled)
          .reduce(flattenInvoicePayersInvoiceItemList, [])

        const previousIndexesInvoiceItemsWithSubtotal = previousIndexesInvoiceItems.reduce(
          computeInvoiceItemSubtotal,
          [],
        )

        const _newInvoicePayerItems = invoicePayer.invoicePayerItem.map(
          (ip) => {
            const _existed = previousIndexesInvoiceItemsWithSubtotal.find(
              (_i) => _i.id === ip.id,
            )

            if (!_existed) return { ...ip, payableBalance: ip.totalAfterGst }

            return {
              ...ip,
              payableBalance:
                _existed.payableBalance - _existed._prevClaimedAmount,
            }
          },
        )
        const _newInvoicePayer = {
          ...invoicePayer,
          invoicePayerItem: _newInvoicePayerItems,
        }
        return [
          ..._newInvoicePayers,
          _newInvoicePayer,
        ]
      },
      [],
    )
    setTempInvoicePayer(_newTempInvoicePayer)
    // refTempInvociePayer.current = tempInvoicePayer
  }

  const _isSubtotalLessThanZero = (index) => {
    const sum = tempInvoicePayer[index].invoicePayerItem.reduce(
      (totalClaim, item) => totalClaim + (item.claimAmount || 0),
      0,
    )

    return sum <= 0
  }

  const toggleCopayerModal = () => setShowCoPaymentModal(!showCoPaymentModal)
  const toggleErrorPrompt = () => {
    if (showErrorPrompt) setErrorMessage([])
    setShowErrorPrompt(!showErrorPrompt)
  }

  const handleClaimAmountChange = (id) => (event) => {
    const _editingInvoicePayer = refTempInvociePayer.current.find(
      (item) => item._isEditing,
    )
    const index = refTempInvociePayer.current.findIndex(
      (item) => item._isEditing,
    )
    const totalPayableBalance = refTempInvociePayer.current
      .reduce(flattenInvoicePayersInvoiceItemList, [])
      .filter(
        (item) =>
          item.invoiceItemFK ? item.invoiceItemFK === id : item.id === id,
      )
      .reduce(
        (largestPayable, item) =>
          item.payableBalance > largestPayable
            ? item.payableBalance
            : largestPayable,
        0,
      )

    const currentItemClaimedAmount = refTempInvociePayer.current
      .reduce(flattenInvoicePayersInvoiceItemList, [])
      .reduce((remainingClaimable, item) => {
        if (
          item.invoiceItemFK &&
          parseInt(item.invoiceItemFK, 10) === parseInt(id, 10)
        )
          return remainingClaimable + item.claimAmount
        if (parseInt(item.id, 10) === parseInt(id, 10)) {
          return remainingClaimable + item.claimAmount
        }
        return remainingClaimable
      }, 0)

    const newTempInvoicePayer = {
      ..._editingInvoicePayer,
      invoicePayerItem: _editingInvoicePayer.invoicePayerItem.map((item) => {
        const _id = item.invoiceItemFK ? item.invoiceItemFK : item.id

        if (parseInt(_id, 10) === parseInt(id, 10)) {
          const currentClaimAmount = item.claimAmount
          const toBeChangeAmount = event.target.value
          if (currentItemClaimedAmount === 0)
            return { ...item, claimAmount: toBeChangeAmount }

          const eligibleAmount =
            totalPayableBalance -
            (currentItemClaimedAmount - currentClaimAmount)
          if (
            eligibleAmount === 0 ||
            toBeChangeAmount <= eligibleAmount ||
            Number.isNaN(eligibleAmount)
          )
            return { ...item, claimAmount: toBeChangeAmount, error: undefined }

          return {
            ...item,
            claimAmount: toBeChangeAmount,
            error: `Cannot claim more than $${eligibleAmount.toFixed(2)}`,
          }
        }
        return { ...item, error: undefined }
      }),
    }
    _updateTempInvoicePayer(index, newTempInvoicePayer)
  }

  useEffect(
    () => {
      const finalClaim = roundTo(
        tempInvoicePayer.reduce(computeTotalForAllSavedClaim, 0),
      )
      let finalPayable = roundTo(invoice.totalAftGst - finalClaim)
      const totalPaid = invoicePayment.reduce((totalAmtPaid, payment) => {
        if (!payment.isCancelled) return totalAmtPaid + payment.totalAmtPaid
        return totalAmtPaid
      }, 0)
      const newOutstandingBalance = roundTo(invoice.totalAftGst - totalPaid)

      const updatedInvoiceItems = updateOriginalInvoiceItemList()
      const _values = {
        ...values,
        finalClaim,
        finalPayable,
        invoice: {
          ...values.invoice,
          outstandingBalance: newOutstandingBalance,
          patientOutstandingBalance: roundTo(finalPayable - totalPaid),
          invoiceItems: updatedInvoiceItems,
        },
        invoicePayer: tempInvoicePayer,
      }
      setValues(_values)
      // setFieldValue('finalClaim', finalClaim)
      // setFieldValue('finalPayable', finalPayable)
      // setFieldValue(
      //   'invoice.outstandingBalance',
      //   roundTo(finalPayable - finalClaim),
      // )
      // setFieldValue('invoice.invoiceItems', updatedInvoiceItems)
      // setFieldValue('invoicePayer', tempInvoicePayer)
      handleIsEditing(hasEditing())

      refTempInvociePayer.current = tempInvoicePayer
    },
    [
      tempInvoicePayer,
    ],
  )

  const handleSchemeChange = (index) => (value) => {
    const flattenSchemes = claimableSchemes.reduce(
      (schemes, cs) => [
        ...schemes,
        ...cs.map((item) => ({ ...item })),
      ],
      [],
    )

    const schemeConfig = flattenSchemes.find((item) => item.id === value)
    const {
      balance = null,
      isBalanceCheckRequired = false,
      copayerFK,
      coverageMaxCap = 0,
      coPaymentSchemeName = '',
      patientMinCoPaymentAmount = 0,
      patientMinCoPaymentAmountType = 'ExactAmount',
      id,
    } = schemeConfig

    const _patientMinPayment =
      patientMinCoPaymentAmountType === 'ExactAmount'
        ? patientMinCoPaymentAmount
        : values.finalPayable * patientMinCoPaymentAmount / 100

    // let remainingCoverageMaxCap = coverageMaxCap
    let remainingCoverageMaxCap = coverageMaxCap
    if (_patientMinPayment > 0) {
      const isLessThanMaxCap =
        values.finalPayable - _patientMinPayment < coverageMaxCap
      remainingCoverageMaxCap = isLessThanMaxCap
        ? values.finalPayable - _patientMinPayment
        : coverageMaxCap
    }

    const newInvoiceItems = getInvoiceItems(
      schemeConfig,
      values.invoice.invoiceItems,
      tempInvoicePayer[index] ? tempInvoicePayer[index].invoicePayerItem : [],
      // index,
    )

    const updatedRow = {
      ...tempInvoicePayer[index],
      schemeConfig,
      name: coPaymentSchemeName,
      copaymentSchemeFK: id,
      isModified: true,
      invoicePayerItem: newInvoiceItems.map((item) => {
        let claimAmount = item.payableBalance
        let proceedForChecking = true

        if (
          item._claimedAmount === item.payableBalance ||
          (copayerFK === 1 && balance === null)
        ) {
          proceedForChecking = false
          claimAmount = 0
        } else if (item._claimedAmount > 0) {
          claimAmount = item.payableBalance - item._claimedAmount
        }

        if (proceedForChecking)
          [
            claimAmount,
            remainingCoverageMaxCap,
          ] = getApplicableClaimAmount(
            item,
            schemeConfig,
            remainingCoverageMaxCap,
          )

        return {
          ...item,
          claimAmount: roundTo(claimAmount),
        }
      }),
    }
    _updateTempInvoicePayer(index, updatedRow)
  }

  // run for one time only after getting data from API
  useEffect(
    () => {
      if (values.invoicePayer.length > 0) {
        const newInvoicePayers = values.invoicePayer.map((ip) => {
          if (ip.payerTypeFK === INVOICE_PAYER_TYPE.SCHEME) {
            const _claimableSchemesIndex = claimableSchemes.findIndex(
              (cs) =>
                cs.find((_cs) => _cs.id === ip.copaymentSchemeFK) !== undefined,
            )

            if (claimableSchemes[_claimableSchemesIndex]) {
              const schemeConfig = claimableSchemes[
                _claimableSchemesIndex
              ].find((cs) => cs.id === ip.copaymentSchemeFK)

              return {
                ...ip,
                invoicePayerItem: ip.invoicePayerItem.map((item) => {
                  const { coverage } = getCoverageAmountAndType(
                    schemeConfig,
                    item,
                  )
                  const invoiceItemTypeFK =
                    item.invoiceItemTypeFK === undefined && item.itemType
                      ? INVOICE_ITEM_TYPE_BY_TEXT[item.itemType]
                      : item.invoiceItemTypeFK
                  return { ...item, coverage, invoiceItemTypeFK }
                }),
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
            ...ip,
            _isConfirmed: true,
            _isDeleted: false,
            _isEditing: false,
            _isValid: true,
            // claimableSchemes: claimableSchemes[_claimableSchemesIndex],
          }
        })

        setTempInvoicePayer(newInvoicePayers)
        setInitialState(newInvoicePayers)
        refTempInvociePayer.current = newInvoicePayers
      } else if (claimableSchemes.length > 0 && invoicePayment.length === 0) {
        const _invoicePayer = {
          _indexInClaimableSchemes: 0,
          _isConfirmed: false,
          _isDeleted: false,
          _isEditing: true,
          _isValid: true,
          isDeleted: false,
          isCancelled: false,
          copaymentSchemeFK: undefined,
          name: '',
          payerDistributedAmt: 0,
          claimableSchemes: claimableSchemes[0],
          invoicePayerItem: [],
          sequence: 0,
          payerTypeFK: INVOICE_PAYER_TYPE.SCHEME,
        }
        setTempInvoicePayer([
          _invoicePayer,
        ])
        setCurEditInvoicePayerBackup(_invoicePayer)
        setInitialState([
          _invoicePayer,
        ])
      } else {
        setInitialState([])
        setTempInvoicePayer([])
        setCurEditInvoicePayerBackup(undefined)
        refTempInvociePayer.current = []
      }
    },
    [
      values.id,
      submitCount,
    ],
  )

  const handleAppliedSchemeSaveClick = (index) => () => {
    const newInvoiceItems = validateInvoicePayerItems(
      tempInvoicePayer[index].invoicePayerItem,
    )
    const hasInvalidRow = newInvoiceItems.reduce(
      (hasError, item) => (item.error ? true : hasError),
      false,
    )

    const updatedRow = {
      ...tempInvoicePayer[index],
      payerDistributedAmt: roundTo(
        newInvoiceItems.reduce(
          (subtotal, item) => subtotal + item.claimAmount,
          0,
        ),
      ),
      isModified: true,
      invoicePayerItem: newInvoiceItems,
      _isConfirmed: !hasInvalidRow,
      _isEditing: hasInvalidRow,
      _isDeleted: false,
    }

    if (hasInvalidRow) {
      // abort early when there is row level error
      _updateTempInvoicePayer(index, updatedRow)
      return false
    }

    const invalidMessages = validateClaimAmount(updatedRow, values.finalPayable)

    if (invalidMessages.length <= 0) {
      setCurEditInvoicePayerBackup(undefined)
      _updateTempInvoicePayer(index, updatedRow)
    } else {
      // const suffix = limitType === 'patient' ? '' : 'maximum cap.'
      setErrorMessage(invalidMessages)
      toggleErrorPrompt()
    }
    return true
  }

  const handleAppliedSchemeCancelClick = useCallback(
    (index) => () => {
      const updatedRow = {
        ...tempInvoicePayer[index],
        ...curEditInvoicePayerBackup,
        _isConfirmed: true,
        _isEditing: false,
        _isDeleted: false,
        isCancelled: false,
      }
      setCurEditInvoicePayerBackup(updatedRow)
      _updateTempInvoicePayer(index, updatedRow)
    },
    [
      curEditInvoicePayerBackup,
    ],
  )

  const handleAppliedSchemeEditClick = (index) => () => {
    const updatedRow = {
      ...tempInvoicePayer[index],
      _isConfirmed: false,
      _isEditing: true,
      _isDeleted: false,
    }
    setCurEditInvoicePayerBackup(updatedRow)
    _updateTempInvoicePayer(index, updatedRow)
  }

  const handleAppliedSchemeRemoveClick = (index) => {
    const updatedRow = {
      ...tempInvoicePayer[index],
      isModified: true,
      _isConfirmed: true,
      _isEditing: false,
      _isDeleted: true,
      isCancelled: true,
    }
    _updateTempInvoicePayer(index, updatedRow)
  }

  const handleAddClaimClick = () => {
    setShowClaimableSchemesSelection(true)
  }

  const handleAddCoPayer = (invoicePayer) => {
    toggleCopayerModal()
    const newTempInvoicePayer = [
      ...tempInvoicePayer,
      invoicePayer,
    ]
    setTempInvoicePayer(newTempInvoicePayer)
    refTempInvociePayer.current = newTempInvoicePayer
  }

  const reset = () => {
    setTempInvoicePayer(initialState)
    refTempInvociePayer.current = initialState
    setCurEditInvoicePayerBackup(undefined)
    onResetClick()
  }

  const handleResetClick = () => {
    dispatch({
      type: 'global/updateState',
      payload: {
        openConfirm: true,
        openConfirmContent:
          'Reset will revert all changes that had not been saved. Continue?',
        openConfirmText: 'Continue',
        onConfirmSave: reset,
      },
    })
  }

  const handleSelectClaimClick = (index) => () => {
    const invoicePayer = {
      _indexInClaimableSchemes: index,
      _isConfirmed: false,
      _isDeleted: false,
      _isEditing: true,
      _isValid: true,
      copaymentSchemeFK: undefined,
      name: '',
      payerDistributedAmt: 0,
      claimableSchemes: claimableSchemes[index],
      invoicePayerItem: [],
      sequence: 0,
      payerTypeFK: INVOICE_PAYER_TYPE.SCHEME,
    }
    setTempInvoicePayer([
      ...tempInvoicePayer,
      invoicePayer,
    ])
    setCurEditInvoicePayerBackup(invoicePayer)
    setShowClaimableSchemesSelection(false)
  }

  const shouldDisableAddApplicableClaim = () => {
    const isEditing = hasEditing()
    const hasUnappliedScheme =
      tempInvoicePayer.filter(
        (invoicePayer) =>
          invoicePayer.payerTypeFK === INVOICE_PAYER_TYPE.SCHEME,
      ).length < invoice.claimableSchemes
    return isEditing || hasUnappliedScheme
  }

  const renderClaimAmount = useCallback(
    (index) => (row) => {
      const { _isConfirmed: shouldDisable } = refTempInvociePayer.current[index]

      return shouldDisable ? (
        <NumberInput currency text value={row.claimAmount} />
      ) : (
        <NumberInput
          currency
          min={0}
          onChange={handleClaimAmountChange(
            row.invoiceItemFK ? row.invoiceItemFK : row.id,
          )}
          value={row.claimAmount}
        />
      )
    },
    [
      handleClaimAmountChange,
      refTempInvociePayer.current,
    ],
  )

  return (
    <React.Fragment>
      <GridItem md={2}>
        <h5 style={{ paddingLeft: 8 }}>Apply Claims</h5>
      </GridItem>
      <GridItem md={10} container justify='flex-end'>
        <Button
          color='primary'
          size='sm'
          disabled={shouldDisableAddApplicableClaim()}
          onClick={handleAddClaimClick}
        >
          <Add />
          Claimable Schemes
        </Button>
        <Button
          color='primary'
          size='sm'
          onClick={toggleCopayerModal}
          disabled={hasEditing()}
        >
          <Add />
          Co-Payer
        </Button>
        <Button color='danger' size='sm' onClick={handleResetClick}>
          <Reset />
          Reset
        </Button>
      </GridItem>
      <GridItem md={12} style={{ maxHeight: '55vh', overflowY: 'auto' }}>
        {tempInvoicePayer.map((invoicePayer, index) => {
          if (invoicePayer.isCancelled) return null

          const { copaymentSchemeFK, _isConfirmed } = invoicePayer
          const claimAmountColExt = {
            columnName: 'claimAmount',
            align: 'right',
            render: renderClaimAmount(index),
          }

          return (
            <Paper
              key={`invoicePayer-${index}`}
              className={classes.gridRow}
              elevation={4}
            >
              <GridContainer style={{ marginBottom: 16 }} alignItems='center'>
                <GridItem md={3} style={{ marginTop: 8, marginBottom: 16 }}>
                  {invoicePayer.payerTypeFK === INVOICE_PAYER_TYPE.SCHEME ? (
                    <Select
                      size='sm'
                      allowClear={false}
                      simple
                      valueField='id'
                      onChange={handleSchemeChange(index)}
                      value={copaymentSchemeFK}
                      disabled={_isConfirmed}
                      options={[
                        ...invoicePayer.claimableSchemes.map((item) => ({
                          id: item.id,
                          name: item.coPaymentSchemeName,
                        })),
                      ]}
                    />
                  ) : (
                    <span>{invoicePayer.name}</span>
                  )}
                </GridItem>
                {invoicePayer.schemeConfig &&
                invoicePayer.schemeConfig.copayerFK === 1 && (
                  <GridItem md={2}>
                    <div>
                      {!invoicePayer.schemeConfig.balance ? (
                        <span className={classes.dangerText}>
                          Insufficient balance
                        </span>
                      ) : (
                        <span className={classes.currencyText}>
                          Balance: ${invoicePayer.schemeConfig.balance}
                        </span>
                      )}
                    </div>
                  </GridItem>
                )}
                <GridItem md={2} style={{ marginTop: 8, marginBottom: 8 }}>
                  {invoicePayer.payerTypeFK === INVOICE_PAYER_TYPE.SCHEME && (
                    <NumberInput
                      currency
                      text
                      prefix='Max. Cap:'
                      suffix={
                        <MaxCapInfo
                          claimableSchemes={invoicePayer.claimableSchemes}
                          copaymentSchemeFK={invoicePayer.copaymentSchemeFK}
                        />
                      }
                      value={
                        invoicePayer.schemeConfig ? (
                          invoicePayer.schemeConfig.coverageMaxCap
                        ) : (
                          0
                        )
                      }
                    />
                  )}
                </GridItem>
                <GridItem
                  md={
                    invoicePayer.schemeConfig &&
                    invoicePayer.schemeConfig.copayerFK === 1 ? (
                      5
                    ) : (
                      7
                    )
                  }
                  style={{ textAlign: 'right', paddingRight: '0px !important' }}
                >
                  <DeleteWithPopover
                    index={index}
                    disabled={invoicePayer._isEditing ? false : hasEditing()}
                    onConfirmDelete={handleAppliedSchemeRemoveClick}
                  />
                </GridItem>
                <GridItem md={12}>
                  <CommonTableGrid
                    key={`invoicePayer-${index}`}
                    size='sm'
                    FuncProps={{ pager: false }}
                    // EditingProps={{
                    //   showAddCommand: false,
                    //   showDeleteCommand: false,
                    //   showEditCommand: false,
                    //   onEditingRowIdsChange: handleEditingRowIdsChange(index),
                    //   onCommitChanges: handleCommitChanges(index),
                    //   // editingRowIds: _isEditing
                    //   //   ? invoicePayerItem.map((item) => item.id)
                    //   //   : [],
                    // }}
                    // schema={validationSchema}
                    columns={
                      invoicePayer.payerTypeFK === INVOICE_PAYER_TYPE.SCHEME ? (
                        SchemeInvoicePayerColumn
                      ) : (
                        CompanyInvoicePayerColumn
                      )
                    }
                    columnExtensions={[
                      ...ApplyClaimsColumnExtension,
                      claimAmountColExt,
                    ]}
                    rows={invoicePayer.invoicePayerItem}
                  />
                </GridItem>
                <GridItem md={8} />
                <GridItem md={4} className={classes.gridActionBtn}>
                  {invoicePayer._isEditing && (
                    <React.Fragment>
                      <Button
                        size='sm'
                        color='danger'
                        onClick={handleAppliedSchemeCancelClick(index)}
                        disabled={
                          invoicePayer.payerTypeFK ===
                            INVOICE_PAYER_TYPE.SCHEME &&
                          invoicePayer.copaymentSchemeFK === undefined
                        }
                      >
                        Cancel
                      </Button>
                      <Button
                        size='sm'
                        color='primary'
                        className={classes.rightEndBtn}
                        onClick={handleAppliedSchemeSaveClick(index)}
                        disabled={_isSubtotalLessThanZero(index)}
                      >
                        Apply
                      </Button>
                    </React.Fragment>
                  )}
                  {invoicePayer._isConfirmed && (
                    <Button
                      size='sm'
                      color='primary'
                      className={classes.rightEndBtn}
                      onClick={handleAppliedSchemeEditClick(index)}
                      disabled={hasEditing()}
                    >
                      Edit
                    </Button>
                  )}
                </GridItem>
              </GridContainer>
            </Paper>
          )
        })}
      </GridItem>
      {/* <GridItem md={12} style={{ textAlign: 'right' }}>
        <Button size='sm' color='success'>
          Save Changes
        </Button>
      </GridItem> */}
      {/* <GridItem md={12}>
        <Paper className={classes.gridRow}>
          <Primary>
            <h5>This patient still has applicable schemes</h5>
          </Primary>
        </Paper>
      </GridItem> */}
      <CommonModal
        open={showClaimableSchemesSelection}
        title='Claimable Schemes'
        onClose={() =>
          setShowClaimableSchemesSelection(!showClaimableSchemesSelection)}
        maxWidth='sm'
      >
        <ApplicableClaims
          currentClaims={tempInvoicePayer.filter(
            (invoicePayer) => !invoicePayer.isCancelled,
          )}
          claimableSchemes={claimableSchemes}
          handleSelectClick={handleSelectClaimClick}
        />
      </CommonModal>
      <CommonModal
        title='Add Copayer'
        open={showCoPaymentModal}
        onClose={toggleCopayerModal}
      >
        <CoPayer
          onAddCoPayerClick={handleAddCoPayer}
          invoiceItems={invoice.invoiceItems.map((invoiceItem) => ({
            ...invoiceItem,
            itemName: invoiceItem.itemDescription,
            schemeCoverage: 100,
            schemeCoverageType: 'Percentage',
            payableBalance:
              invoiceItem.totalAfterGst - (invoiceItem._claimedAmount || 0),
          }))}
          // invoiceItems={
          //   tempInvoicePayer.length > 0 ? (
          //     tempInvoicePayer.reduce(flattenInvoicePayersInvoiceItemList, [])
          //   ) : (
          //     invoice.invoiceItems.map((invoiceItem) => ({
          //       ...invoiceItem,
          //       claimAmount: 0,
          //       itemName: invoiceItem.itemDescription,
          //       schemeCoverage: 100,
          //       schemeCoverageType: 'Percentage',
          //       payableBalance: invoiceItem.totalAfterGst,
          //     }))
          //   )
          // }
        />
      </CommonModal>
      <CommonModal
        title='Cannot save scheme'
        open={showErrorPrompt}
        onClose={toggleErrorPrompt}
        maxWidth='sm'
      >
        <div className={classes.errorPromptContainer}>
          {errorMessage.map((message) => <p>{message}</p>)}
        </div>
      </CommonModal>
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'ApplyClaims' })(ApplyClaims)
