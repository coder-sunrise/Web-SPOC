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
      (category) => category.itemTypeFk === invoiceItem.invoiceItemTypeFk,
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
      (category) => category.itemTypeFk === invoicePayerItem.invoiceItemTypeFk,
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
      item.invoiceItemTypeFk === type ? subtotal + item.claimAmount : subtotal,
    0,
  )

export const validateClaimAmount = (schemeRow, totalPayable) => {
  let invalidMessage = []

  const { schemeConfig, invoicePayerItem, payerTypeFK } = schemeRow
  if (payerTypeFK === INVOICE_PAYER_TYPE.COMPANY) return []

  const {
    balance,
    coverageMaxCap,
    patientMinCoPaymentAmount,
    patientMinCoPaymentAmountType,
    medicationCoverageMaxCap,
    consumableCoverageMaxCap,
    serviceCoverageMaxCap,
    vaccinationCoverageMaxCap,
    packageCoverageMaxCap,

    isCoverageMaxCapCheckRequired,
    isMedicationCoverageMaxCapCheckRequired,
    isConsumableCoverageMaxCapCheckRequired,
    isVaccinationCoverageMaxCapCheckRequired,
    isServiceCoverageMaxCapCheckRequired,
    isPackageCoverageMaxCapCheckRequired,
  } = schemeConfig

  const listOfLimits = []

  if (balance !== null && balance > 0) listOfLimits.push(balance)

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
    const medicationTotalClaim = getItemTypeSubtotal(invoicePayerItem, 1)
    const consumableTotalClaim = getItemTypeSubtotal(invoicePayerItem, 2)
    const vaccinationTotalClaim = getItemTypeSubtotal(invoicePayerItem, 3)
    const serviceTotalClaim = getItemTypeSubtotal(invoicePayerItem, 4)
    const packageTotalClaim = getItemTypeSubtotal(invoicePayerItem, 5)

    if (
      isMedicationCoverageMaxCapCheckRequired &&
      medicationTotalClaim > medicationCoverageMaxCap
    )
      invalidMessage.push('Medication claim amount has exceed the max cap')

    if (
      isConsumableCoverageMaxCapCheckRequired &&
      consumableTotalClaim > consumableCoverageMaxCap
    )
      invalidMessage.push('Consumable claim amount has exceed the max cap')

    if (
      isVaccinationCoverageMaxCapCheckRequired &&
      vaccinationTotalClaim > vaccinationCoverageMaxCap
    )
      invalidMessage.push('Vaccination claim amount has exceed the max cap')

    if (
      isServiceCoverageMaxCapCheckRequired &&
      serviceTotalClaim > serviceCoverageMaxCap
    )
      invalidMessage.push('Service total claim amount has exceed the max cap')

    if (
      isPackageCoverageMaxCapCheckRequired &&
      packageTotalClaim > packageCoverageMaxCap
    )
      invalidMessage.push('Package total claim amount has exceed the max cap')
  }

  const totalClaimAmount = invoicePayerItem.reduce(
    (totalClaim, item) => totalClaim + (item.claimAmount || 0),
    0,
  )

  const maximumLimit = Math.min(listOfLimits)

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
    invoicePayer: invoicePayer
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
              if (item.invoiceItemFK) {
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
                invoiceItemFK: id,
                payableBalance,
                invoiceItemTypeFK,
                itemType: INVOICE_ITEM_TYPE[invoiceItemTypeFK],
                itemName: itemDescription,
              }
              return _invoicePayerItem
            }),
        }
        return _payer
      }),
  }
  return payload
}
