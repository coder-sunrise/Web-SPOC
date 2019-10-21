export const flattenInvoicePayersInvoiceItemList = (
  preInvoicePayerInvoiceItems,
  preInvoicePayer,
) => [
  ...preInvoicePayerInvoiceItems,
  ...preInvoicePayer.invoicePayerItems,
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
  payer._isConfirmed
    ? sum +
      payer.invoicePayerItems.reduce(
        (subtotal, item) =>
          subtotal + (item.claimAmount ? item.claimAmount : 0),
        0,
      )
    : sum

export const convertAmountToPercentOrCurrency = (type, amount) =>
  type.toLowerCase() === 'percentage' ? `${amount}%` : `$${amount}`

export const getCoverageAmountAndType = (scheme, invoiceItem) => {
  let coverage = 0
  let schemeCoverageType = 'percentage'
  let schemeCoverage = 0

  // 1. first priority: coPaymentByItem
  // 2. second priority: coPaymentByCategory
  // 3. third priority: overall value

  const isSpecificDefined = scheme.coPaymentByItem.find(
    (_coPaymentItem) => _coPaymentItem.itemFk === invoiceItem.id,
  )

  if (isSpecificDefined) {
    const coPaymentItem = scheme.coPaymentByItem.find(
      (_coPaymentItem) => _coPaymentItem.itemFk === invoiceItem.id,
    )

    coverage = convertAmountToPercentOrCurrency(
      coPaymentItem.itemValueType,
      coPaymentItem.itemValue,
    )
    schemeCoverage = coverage
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
      scheme.overAllCoPaymentValueType,
      scheme.overAllCoPaymentValue,
    )
    schemeCoverage = scheme.overAllCoPaymentValue
    schemeCoverageType = scheme.overAllCoPaymentValueType
  }

  return { coverage, schemeCoverage, schemeCoverageType }

  // let coverage = 0
  // let schemeCoverageType = 'Percentage'
  // let schemeCoverage = 0

  // get coverage amount
  // 1. first priority: coPaymentByItem
  // 2. second priority: coPaymentByCategory
  // 3. third priority: overall value
  // if (scheme.coPaymentByItem.length > 0) {
  //   const coPaymentItem = scheme.coPaymentByItem.find(
  //     (_coPaymentItem) => _coPaymentItem.itemFk === item.id,
  //   )

  //   coverage = convertAmountToPercentOrCurrency(
  //     coPaymentItem.itemValueType,
  //     coPaymentItem.itemValue,
  //   )
  // } else if (scheme.coPaymentByCategory.length > 0) {
  //   // use coverage
  //   const itemCategory = scheme.coPaymentByCategory.find(
  //     (category) => category.itemTypeFk === item.invoiceItemTypeFk,
  //   )
  //   coverage = convertAmountToPercentOrCurrency(
  //     itemCategory.groupValueType,
  //     itemCategory.itemGroupValue,
  //   )

  //   schemeCoverage = itemCategory.itemGroupValue
  //   schemeCoverageType = itemCategory.groupValueType
  // } else {
  //   schemeCoverageType = scheme.overAllCoPaymentValueType
  //   schemeCoverage = scheme.overAllCoPaymentValue
  //   coverage = convertAmountToPercentOrCurrency(
  //     scheme.overAllCoPaymentValueType,
  //     scheme.overAllCoPaymentValue,
  //   )
  // }
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
  } = scheme
  let returnClaimAmount = 0

  if (invoicePayerItem.totalAfterGst === 0)
    return [
      0,
      remainingCoverageMaxCap,
    ]

  const isSpecificDefined = scheme.coPaymentByItem.find(
    (_coPaymentItem) => _coPaymentItem.itemFk === invoicePayerItem.id,
  )

  if (isSpecificDefined) {
    const specificItem = scheme.coPaymentByItem.find(
      (_coPaymentItem) => _coPaymentItem.itemFk === invoicePayerItem.id,
    )
    // TODO get coverage amount from specific item object
    returnClaimAmount = 0
  } else if (coPaymentByCategory.length > 0) {
    const itemCategory = coPaymentByCategory.find(
      (category) => category.itemTypeFk === invoicePayerItem.invoiceItemTypeFk,
    )
    const itemRemainingAmount =
      invoicePayerItem.totalAfterGst - (invoicePayerItem._claimedAmount || 0)

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
    returnClaimAmount =
      invoicePayerItem.totalAfterGst - (invoicePayerItem._claimedAmount || 0)
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

  return [
    returnClaimAmount,
    remainingCoverageMaxCap,
  ]
}

export const validateClaimAmount = (schemeRow, totalPayable) => {
  let isValid = true

  const {
    _balance,
    _patientMinPayable,
    _patientMinPayableType,
    _coverageMaxCap,
    invoicePayerItems,
    isCoverageMaxCapCheckRequired,
    medicationCoverageMaxCap,
    consumableCoverageMaxCap,
    serviceCoverageMaxCap,
    vaccinationCoverageMaxCap,
  } = schemeRow

  let limit = 0
  const listOfLimits = [
    _balance,
  ]

  if (_patientMinPayable !== 0) {
    const amount =
      _patientMinPayableType === 'ExactAmount'
        ? _patientMinPayable
        : totalPayable * (_patientMinPayable / 100)
    listOfLimits.push(_patientMinPayable)
  }

  if (isCoverageMaxCapCheckRequired) {
    listOfLimits.push(_coverageMaxCap)
  } else {
    // check for each item category
    // return isValid = false early
  }

  // if (_patientMinPayable === 0 && _coverageMaxCap === 0) {
  //   // skip checking
  //   return { isValid: true, limitType: undefined }
  // }

  // const totalClaimAmount = invoicePayerItems.reduce(
  //   (totalClaim, item) => totalClaim + (item.claimAmount || 0),
  //   0,
  // )

  // const amount =
  //   _patientMinPayableType === 'ExactAmount'
  //     ? _patientMinPayable
  //     : totalPayable * (_patientMinPayable / 100)
  // const patientMinPayable = totalPayable - amount

  // const maximumLimit = Math.min(patientMinPayable, _coverageMaxCap)

  // const limitType = patientMinPayable < _coverageMaxCap ? 'patient' : 'maxcap'
  // if (maximumLimit > 0) isValid = totalClaimAmount <= maximumLimit

  // return { isValid, limitType }
}
