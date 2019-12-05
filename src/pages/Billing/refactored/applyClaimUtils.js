import _ from 'lodash'
import { roundTo } from '@/utils/utils'
import {
  INVOICE_PAYER_TYPE,
  INVOICE_ITEM_TYPE_BY_TEXT,
} from '@/utils/constants'

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

  const payableBalance =
    invoicePayerItem.totalAfterGst - invoicePayerItem._claimedAmount
  if (payableBalance <= 0) return returnClaimAmount

  const isSpecificDefined = coPaymentByItem.find(
    (_coPaymentItem) => _coPaymentItem.itemCode === invoicePayerItem.itemCode,
  )

  if (isSpecificDefined) {
    const specificItem = coPaymentByItem.find(
      (_coPaymentItem) => _coPaymentItem.itemCode === invoicePayerItem.itemCode,
    )
    // TODO get coverage amount from specific item object
    const itemRemainingAmount =
      payableBalance - (invoicePayerItem._claimedAmount || 0)

    if (specificItem.itemValueType.toLowerCase() === 'percentage')
      returnClaimAmount = itemRemainingAmount * (specificItem.itemValue / 100)
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
      payableBalance - (invoicePayerItem._claimedAmount || 0)
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
      payableBalance - (invoicePayerItem._claimedAmount || 0)
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
  if (returnClaimAmount > payableBalance) returnClaimAmount = payableBalance

  return returnClaimAmount
}

export const getInvoiceItemsWithClaimAmount = (
  schemeConfig,
  originalInvoiceItems = [],
  currentInvoiceItems = [],
) => {
  if (!schemeConfig || _.isEmpty(schemeConfig)) return []
  const { coverageMaxCap } = schemeConfig
  console.log({ schemeConfig })
  const invoiceItems = originalInvoiceItems.reduce((result, item) => {
    if (item.notClaimableBySchemeIds.includes(schemeConfig.id))
      return [
        ...result,
      ]

    if (
      schemeConfig.id === 14 &&
      item.invoiceItemTypeFK === 4 &&
      item.id === 1251
    ) {
      return [
        ...result,
      ]
    }

    // if (
    //   schemeConfig.claimType &&
    //   schemeConfig.claimType.toLowerCase() === 'cdmp' &&
    //   item.invoiceItemTypeFK === 3
    // ) {
    //   return [
    //     ...result,
    //   ]
    // }

    const existedItem = currentInvoiceItems.find(
      (curItem) => curItem.id === item.id,
    )
    let {
      coverage, // for display purpose only, value will be $100 or 100%
      schemeCoverage, // for sending to backend
      schemeCoverageType, // for sending to backend
    } = getCoverageAmountAndType(schemeConfig, item)
    const { invoiceItemTypeFK } = item

    const remainingCoverageMaxCap =
      coverageMaxCap - result.reduce((total, i) => total + i.claimAmount, 0)

    const _claimAmount = getApplicableClaimAmount(
      item,
      schemeConfig,
      remainingCoverageMaxCap,
    )

    if (existedItem)
      return [
        ...result,
        {
          ...existedItem,
          coverage,
          schemeCoverageType,
          schemeCoverage,
          itemName: existedItem.itemDescription,
          claimAmount: _claimAmount,
        },
      ]

    return [
      ...result,
      {
        ...item,
        invoiceItemTypeFK,
        payableBalance: item.totalAfterGst,
        coverage,
        schemeCoverageType,
        schemeCoverage,
        itemName: item.itemDescription,
        claimAmount: _claimAmount,
      },
    ]
  }, [])
  return invoiceItems
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

export const updateOriginalInvoiceItemList = (
  invoiceItems,
  currentInvoicePayerList,
) => {
  const _resultInvoiceItems = invoiceItems.map((item) => {
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
    const _subtotal = currentInvoicePayerList.reduce(
      computeInvoicePayerSubtotal,
      0,
    )
    return { ...item, _claimedAmount: _subtotal }
  })

  return _resultInvoiceItems
}

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
  console.log({ listOfLimits, maximumLimit })

  if (maximumLimit > 0 && totalClaimAmount > maximumLimit)
    invalidMessage.push('Total claim amount has exceed the maximum limit')

  return invalidMessage
}

export const computeInvoiceItemPrevClaimedAmount = (invoiceItems, item) => {
  const _existed = invoiceItems.find((_i) => _i.id === item.id)
  if (!_existed)
    return [
      ...invoiceItems,
      { ...item, _prevClaimedAmount: item.claimAmount },
    ]
  return [
    ...invoiceItems.filter((_i) => _i.id !== item.id),
    {
      ..._existed,
      _prevClaimedAmount: _existed._prevClaimedAmount + item.claimAmount,
    },
  ]
}

export const updateInvoicePayerPayableBalance = (
  originalInvoiceItems,
  list,
  updatedIndex,
) => {
  const result = list.reduce((_payers, payer, index) => {
    // dp nothing when payer isCancelled
    if (payer.isCancelled)
      return [
        ..._payers,
        payer,
      ]

    // first payer use totalAfterGst as payable balance
    if (index === 0)
      return [
        ..._payers,
        {
          ...payer,
          invoicePayerItem: payer.invoicePayerItem.map((item) => {
            const original = originalInvoiceItems.find(
              (oriInvoiceItem) =>
                payer.id
                  ? oriInvoiceItem.id === item.invoiceItemFK
                  : oriInvoiceItem.id === item.id,
            )
            return { ...item, payableBalance: original.totalAfterGst }
          }),
        },
      ]

    // all previous payer remains the same as is
    if (index < updatedIndex)
      return [
        ..._payers,
        payer,
      ]

    // compute previous claimed amount up to current modify payer
    const prevIndexInvoiceItemsWithSubtotal = _payers
      .filter((p) => !p.isCancelled)
      .reduce(flattenInvoicePayersInvoiceItemList, [])
      .reduce(computeInvoiceItemPrevClaimedAmount, [])

    // update payable balance according to the claimed amount
    const newInvoicePayerItem = payer.invoicePayerItem.map((item) => {
      const _existed = prevIndexInvoiceItemsWithSubtotal.find(
        (itemWithSubtotal) => itemWithSubtotal.id === item.id,
      )
      if (!_existed) return { ...item, payableBalance: item.totalAfterGst }
      return {
        ...item,
        payableBalance: _existed.payableBalance - _existed._prevClaimedAmount,
      }
    })
    return [
      ..._payers,
      { ...payer, invoicePayerItem: newInvoicePayerItem },
    ]
  }, [])

  return result
}

export const sortItemByID = (itemA, itemB) => {
  if (itemA.id > itemB.id) return 1
  if (itemA.id < itemB.id) return -1
  return 0
}
