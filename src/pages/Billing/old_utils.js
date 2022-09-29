import { INVOICE_ITEM_TYPE, INVOICE_PAYER_TYPE } from '@/utils/constants'

export const flattenInvoicePayersInvoiceItemList = (
  preInvoicePayerInvoiceItems,
  preInvoicePayer,
) =>
  preInvoicePayer.isCancelled
    ? [
        ...preInvoicePayerInvoiceItems,
      ]
    : [
        ...preInvoicePayerInvoiceItems,
        ...preInvoicePayer.invoicePayerItem,
      ]

export const computeInvoiceItemSubtotal = (invoiceItems, item) => {
  const _existed = invoiceItems.find((_i) => _i.id === item.id)
  if (!_existed)
    return [
      ...invoiceItems,
      { ...item, _prevClaimedAmount: item.claimAmount },
    ]
  return [
    ...invoiceItems.filter((_i) => _i.id === item.id),
    {
      ..._existed,
      _prevClaimedAmount: _existed._prevClaimedAmount + item.claimAmount,
    },
  ]
}

export const computeTotalForAllSavedClaim = (sum, payer) =>
  payer._isConfirmed && !payer.isCancelled
    ? sum +
      payer.invoicePayerItem.reduce(
        (subtotal, item) =>
          subtotal + (item.claimAmount ? item.claimAmount : 0),
        0,
      )
    : sum

export const convertAmountToPercentOrCurrency = (type, amount) =>
  type.toLowerCase() === 'percentage' ? `${amount}%` : `$${amount.toFixed(2)}`

export const getCoverageAmountAndType = (scheme, invoiceItem) => {
  let coverage = 0
  let schemeCoverageType = 'percentage'
  let schemeCoverage = 0

  // 1. first priority: coPaymentByItem
  // 2. second priority: coPaymentByCategory
  // 3. third priority: overall value

  const isSpecificDefined = scheme.coPaymentByItem.find(
    (_coPaymentItem) => _coPaymentItem.itemCode === invoiceItem.itemCode,
  )
  if (isSpecificDefined) {
    const coPaymentItem = scheme.coPaymentByItem.find(
      (_coPaymentItem) => _coPaymentItem.itemCode === invoiceItem.itemCode,
    )

    coverage = convertAmountToPercentOrCurrency(
      coPaymentItem.itemValueType,
      coPaymentItem.itemValue,
    )
    schemeCoverage = coPaymentItem.itemValue
    schemeCoverageType = coPaymentItem.itemValueType
    return { coverage, schemeCoverage, schemeCoverageType }
  }

  if (scheme.coPaymentByCategory.length > 0) {
    const itemCategory = scheme.coPaymentByCategory.find(
      (category) => category.itemTypeFk === invoiceItem.invoiceItemTypeFK,
    )

    coverage = convertAmountToPercentOrCurrency(
      itemCategory.groupValueType,
      itemCategory.itemGroupValue,
    )
    schemeCoverage = itemCategory.itemGroupValue
    schemeCoverageType = itemCategory.groupValueType
  } else {
    coverage = convertAmountToPercentOrCurrency(
      scheme.overAllCoPaymentValue
        ? scheme.overAllCoPaymentValueType
        : 'Percentage',
      scheme.overAllCoPaymentValue || 100,
    )
    schemeCoverage = scheme.overAllCoPaymentValue || 100
    schemeCoverageType = scheme.overAllCoPaymentValue
      ? scheme.overAllCoPaymentValueType
      : 'Percentage'
  }

  return { coverage, schemeCoverage, schemeCoverageType }
}

export const getApplicableClaimAmount = (
  invoicePayerItem,
  scheme,
  remainingCoverageMaxCap,
) => {
  const {
    coPaymentByCategory,
    coPaymentByItem,
    isCoverageMaxCapCheckRequired,
    overAllCoPaymentValue,
    overAllCoPaymentValueType,
  } = scheme
  let returnClaimAmount = 0

  if (invoicePayerItem.payableBalance === 0)
    return [
      0,
      remainingCoverageMaxCap,
    ]

  const isSpecificDefined = coPaymentByItem.find(
    (_coPaymentItem) => _coPaymentItem.itemCode === invoicePayerItem.itemCode,
  )

  if (isSpecificDefined) {
    const specificItem = coPaymentByItem.find(
      (_coPaymentItem) => _coPaymentItem.itemCode === invoicePayerItem.itemCode,
    )
    // TODO get coverage amount from specific item object
    const itemRemainingAmount =
      invoicePayerItem.payableBalance - (invoicePayerItem._claimedAmount || 0)
    if (specificItem.itemValueType.toLowerCase() === 'percentage')
      returnClaimAmount =
        itemRemainingAmount * (specificItem.itemGroupValue / 100)
    else {
      returnClaimAmount =
        specificItem.itemValue > itemRemainingAmount
          ? itemRemainingAmount
          : specificItem.itemValue
    }
  } else if (coPaymentByCategory.length > 0) {
    const itemCategory = coPaymentByCategory.find(
      (category) => category.itemTypeFk === invoicePayerItem.invoiceItemTypeFK,
    )
    const itemRemainingAmount =
      invoicePayerItem.payableBalance - (invoicePayerItem._claimedAmount || 0)
    if (itemCategory.groupValueType.toLowerCase() === 'percentage') {
      returnClaimAmount =
        itemRemainingAmount * (itemCategory.itemGroupValue / 100)
    } else {
      returnClaimAmount =
        itemCategory.itemGroupValue > itemRemainingAmount
          ? itemRemainingAmount
          : itemCategory.itemGroupValue
    }
  } else {
    const itemRemainingAmount =
      invoicePayerItem.payableBalance - (invoicePayerItem._claimedAmount || 0)
    const copaymentValue =
      overAllCoPaymentValueType.toLowerCase() === 'percentage'
        ? itemRemainingAmount * (overAllCoPaymentValue / 100)
        : overAllCoPaymentValue

    returnClaimAmount =
      copaymentValue > itemRemainingAmount
        ? itemRemainingAmount
        : copaymentValue
  }

  if (isCoverageMaxCapCheckRequired) {
    if (returnClaimAmount > remainingCoverageMaxCap) {
      returnClaimAmount = remainingCoverageMaxCap
      remainingCoverageMaxCap = 0
    } else if (returnClaimAmount < remainingCoverageMaxCap) {
      remainingCoverageMaxCap -= returnClaimAmount
    } else {
      returnClaimAmount = remainingCoverageMaxCap
    }
  }
  if (returnClaimAmount > invoicePayerItem.payableBalance)
    returnClaimAmount = invoicePayerItem.payableBalance

  return [
    returnClaimAmount,
    remainingCoverageMaxCap,
  ]
}

const getItemTypeSubtotal = (list, type) =>
  list.reduce(
    (subtotal, item) =>
      item.invoiceItemTypeFK === type ? subtotal + item.claimAmount : subtotal,
    0,
  )

export const validateClaimAmount = (schemeRow, totalPayable) => {
  let invalidMessage = []

  const { schemeConfig, invoicePayerItem, payerTypeFK } = schemeRow
  if (payerTypeFK === INVOICE_PAYER_TYPE.COMPANY) return []

  const {
    balance,
    balanceStatusCode,
    isBalanceCheckRequired,
    coverageMaxCap,
    patientMinCoPaymentAmount,
    patientMinCoPaymentAmountType,
    consumableCoverageMaxCap,
    serviceCoverageMaxCap,
    orderSetCoverageMaxCap,

    isCoverageMaxCapCheckRequired,
    isConsumableCoverageMaxCapCheckRequired,
    isServiceCoverageMaxCapCheckRequired,
    isOrderSetCoverageMaxCapCheckRequired,
    schemeCategoryFK,
  } = schemeConfig

  const listOfLimits = []

  // check balance
  if (isBalanceCheckRequired) {
    if (schemeCategoryFK && parseInt(schemeCategoryFK, 10) !== 3)
      listOfLimits.push(balance)
  }

  if (patientMinCoPaymentAmount > 0) {
    const amount =
      patientMinCoPaymentAmountType === 'ExactAmount'
        ? patientMinCoPaymentAmount
        : totalPayable * (patientMinCoPaymentAmount / 100)
    listOfLimits.push(totalPayable - amount)
  }
  if (isCoverageMaxCapCheckRequired) {
    if (coverageMaxCap > 0) listOfLimits.push(coverageMaxCap)
  } else {
    // check for each item category
    // return isValid = false early
    const consumableTotalClaim = getItemTypeSubtotal(invoicePayerItem, 2)
    const serviceTotalClaim = getItemTypeSubtotal(invoicePayerItem, 4)
    const orderSetTotalClaim = getItemTypeSubtotal(invoicePayerItem, 5)

    if (
      isConsumableCoverageMaxCapCheckRequired &&
      consumableTotalClaim > consumableCoverageMaxCap
    )
      invalidMessage.push('Consumable claim amount has exceed the max cap')

    if (
      isServiceCoverageMaxCapCheckRequired &&
      serviceTotalClaim > serviceCoverageMaxCap
    )
      invalidMessage.push('Service total claim amount has exceed the max cap')

    if (
      isOrderSetCoverageMaxCapCheckRequired &&
      orderSetTotalClaim > orderSetCoverageMaxCap
    )
      invalidMessage.push('Order Set total claim amount has exceed the max cap')
  }

  const totalClaimAmount = invoicePayerItem.reduce(
    (totalClaim, item) => totalClaim + (item.claimAmount || 0),
    0,
  )
  const maximumLimit = listOfLimits.length > 0 ? Math.min(...listOfLimits) : 0

  if (maximumLimit > 0 && totalClaimAmount > maximumLimit)
    invalidMessage.push('Total claim amount has exceed the maximum limit')

  return invalidMessage
}

export const validateInvoicePayerItems = (invoicePayerItem) => {
  const returnData = invoicePayerItem.map((item) => {
    let maxAmount
    if (item.schemeCoverageType.toLowerCase() === 'percentage') {
      maxAmount = item.payableBalance * item.schemeCoverage / 100
    } else maxAmount = item.payableBalance

    if (item.claimAmount > maxAmount) {
      return { ...item, error: 'Claim Amount cannot exceed Total Payable' }
    }

    return { ...item, error: undefined }
  })
  return returnData
}

export const constructPayload = (values) => {
  const {
    concurrencyToken,
    visitId,
    visitStatus = 'BILLING',
    invoice,
    invoicePayer = [],
    invoicePayment = [],
    mode,
  } = values

  const { invoiceItems, ...restInvoice } = invoice
  const _invoicePayer = invoicePayer
    .map((item, index) => ({ ...item, sequence: index }))
    .filter((payer) => {
      if (payer.id === undefined && payer.isCancelled) return false
      return true
    })
    .filter((payer) => (payer.id ? payer.isModified : true))
    .map((payer) => {
      const {
        schemeConfig,
        _indexInClaimableSchemes,
        _isConfirmed,
        claimableSchemes,
        _isDeleted,
        _isEditing,
        _isValid,
        isModified,
        ...restPayer
      } = payer
      const _payer = {
        ...restPayer,
        isModified: restPayer.id ? isModified : false,
        invoicePayerItem: payer.invoicePayerItem
          .filter((item) => item.claimAmount > 0)
          .map((item) => {
            if (typeof item.id !== 'string') {
              return { ...item }
            }
            const {
              invoiceItemFK,
              _claimedAmount,
              disabled,
              itemCode,
              rowIndex,
              notClaimableBySchemeIds,
              invoiceItemTypeFK,
              itemDescription,
              coverage,
              payableBalance,
              id,
              ...restItem
            } = item

            const _invoicePayerItem = {
              ...restItem,
              invoiceItemFK,
              payableBalance,
              invoiceItemTypeFK,
              itemType: INVOICE_ITEM_TYPE[invoiceItemTypeFK],
              itemName: itemDescription,
            }
            return _invoicePayerItem
          }),
      }
      return _payer
    })

  const payload = {
    mode,
    concurrencyToken,
    visitId,
    visitStatus,
    invoicePayment: invoicePayment
      .filter((item) => {
        if (item.id && item.isCancelled) return true
        if (!item.id) return true
        return false
      })
      .map((item) => ({
        ...item,
        invoicePayerFK: undefined,
      })),
    invoice: restInvoice,
    invoicePayer: _invoicePayer,
  }
  return payload
}
