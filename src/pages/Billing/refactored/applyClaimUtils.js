import _ from 'lodash'
import numeral from 'numeral'
import { roundTo, getUniqueId } from '@/utils/utils'
import { INVOICE_PAYER_TYPE } from '@/utils/constants'

const sumAll = (total, price) => total + price

export const convertAmountToPercentOrCurrency = (type, amount) =>
  type.toLowerCase() === 'percentage' ? `${amount}%` : `$${amount.toFixed(2)}`

export const getCoverageAmountAndType = (scheme, invoiceItem) => {
  let coverage = 0
  let schemeCoverageType = 'percentage'
  let schemeCoverage = 0

  if (_.isEmpty(scheme))
    return {
      coverage: convertAmountToPercentOrCurrency(
        invoiceItem.schemeCoverageType,
        invoiceItem.schemeCoverage,
      ),
      schemeCoverage: invoiceItem.schemeCoverage,
      schemeCoverageType: invoiceItem.schemeCoverageType,
    }

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
  totalClaimableAmount,
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
    invoicePayerItem.totalAfterGst - (invoicePayerItem._claimedAmount || 0)

  if (payableBalance <= 0 || !scheme) return returnClaimAmount

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

  if (returnClaimAmount > totalClaimableAmount)
    returnClaimAmount = totalClaimableAmount

  return returnClaimAmount
}

export const getInvoiceItemsWithClaimAmount = (
  schemeConfig,
  originalInvoiceItems = [],
  currentInvoiceItems = [],
  shouldGenerateDummyID = false,
) => {
  if (!schemeConfig || _.isEmpty(schemeConfig)) return []
  const { coverageMaxCap, patientMinCoPaymentAmount = 0 } = schemeConfig

  const totalInvoiceAmount = originalInvoiceItems
    .map((item) => item.totalAfterGst)
    .reduce(sumAll, 0)

  const totalClaimableAmount =
    totalInvoiceAmount < patientMinCoPaymentAmount
      ? 0
      : totalInvoiceAmount - patientMinCoPaymentAmount

  const invoiceItems = originalInvoiceItems.reduce((result, item) => {
    if (
      item.notClaimableBySchemeIds.includes(schemeConfig.id) ||
      item.totalAfterGst <= 0
    )
      return [
        ...result,
      ]

    const existedItem = currentInvoiceItems.find(
      (curItem) => curItem.invoiceItemFK === item.invoiceItemFK,
    )
    let {
      coverage, // for display purpose only, value will be $100 or 100%
      schemeCoverage, // for sending to backend
      schemeCoverageType, // for sending to backend
    } = getCoverageAmountAndType(schemeConfig, item)
    const { invoiceItemTypeFK } = item

    const pastItemClaimedAmount = result.reduce(
      (total, i) => total + i.claimAmount,
      0,
    )
    const remainingCoverageMaxCap = coverageMaxCap - pastItemClaimedAmount

    const _claimAmount = getApplicableClaimAmount(
      item,
      schemeConfig,
      remainingCoverageMaxCap,
      totalClaimableAmount - pastItemClaimedAmount,
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
        id: shouldGenerateDummyID ? getUniqueId() : item.id,
        invoiceItemFK: item.id,
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
      if (invoicePayer.isCancelled || invoicePayer._isEditing)
        return roundTo(subtotal)
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
    let type = 'Total Payable'
    if (item.schemeCoverageType.toLowerCase() === 'percentage') {
      maxAmount = item.payableBalance * item.schemeCoverage / 100
      type = 'Coverage Amount'
    } else maxAmount = item.payableBalance

    if (item.claimAmount > maxAmount) {
      return { ...item, error: `Claim Amount cannot exceed ${type}` }
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

const calculateTotalPaybable = (total, item) => {
  let coverageAmount = item.schemeCoverage
  if (item.schemeCoverageType === 'Percentage')
    coverageAmount = item.payableBalance * item.schemeCoverage / 100
  else {
    coverageAmount = Math.min(item.schemeCoverage, item.payableBalance)
  }
  return total + coverageAmount
}

export const validateClaimAmount = (schemeRow) => {
  let invalidMessage = []

  const { schemeConfig, invoicePayerItem, payerTypeFK } = schemeRow
  if (payerTypeFK === INVOICE_PAYER_TYPE.COMPANY || !schemeConfig) return []

  const {
    balance,
    isBalanceCheckRequired,
    coverageMaxCap,
    patientMinCoPaymentAmount,
    patientMinCoPaymentAmountType,
    medicationCoverageMaxCap,
    consumableCoverageMaxCap,
    serviceCoverageMaxCap,
    vaccinationCoverageMaxCap,
    orderSetCoverageMaxCap,

    isCoverageMaxCapCheckRequired,
    isMedicationCoverageMaxCapCheckRequired,
    isConsumableCoverageMaxCapCheckRequired,
    isVaccinationCoverageMaxCapCheckRequired,
    isServiceCoverageMaxCapCheckRequired,
    isOrderSetCoverageMaxCapCheckRequired,
  } = schemeConfig

  const listOfLimits = []

  if (isBalanceCheckRequired)
    listOfLimits.push({ type: 'Balance', value: balance })

  const totalClaimAmount = invoicePayerItem.reduce(
    (totalClaim, item) => totalClaim + (item.claimAmount || 0),
    0,
  )

  const totalPayable = invoicePayerItem.reduce(calculateTotalPaybable, 0)
  const patientDistributedAmount = totalPayable - totalClaimAmount

  if (patientMinCoPaymentAmount > 0) {
    const amount =
      patientMinCoPaymentAmountType === 'ExactAmount'
        ? patientMinCoPaymentAmount
        : totalClaimAmount * (patientMinCoPaymentAmount / 100)
    if (patientDistributedAmount < patientMinCoPaymentAmount) {
      invalidMessage.push(
        `Current Patient Min. Payment Amount is: $${patientDistributedAmount.toFixed(
          2,
        )}`,
      )
      invalidMessage.push(
        `Patient Min. Payment Amount must be at least: $${patientMinCoPaymentAmount.toFixed(
          2,
        )}`,
      )
    } else
      listOfLimits.push({
        type: 'Amount after Patient Min. Payable',
        value: totalPayable - amount,
      })
  }
  if (isCoverageMaxCapCheckRequired) {
    if (coverageMaxCap > 0)
      listOfLimits.push({ type: 'Coverage Max Cap', value: coverageMaxCap })
  } else {
    // check for each item category
    // return isValid = false early
    const medicationTotalClaim = getItemTypeSubtotal(invoicePayerItem, 1)
    const consumableTotalClaim = getItemTypeSubtotal(invoicePayerItem, 2)
    const vaccinationTotalClaim = getItemTypeSubtotal(invoicePayerItem, 3)
    const serviceTotalClaim = getItemTypeSubtotal(invoicePayerItem, 4)
    const orderSetTotalClaim = getItemTypeSubtotal(invoicePayerItem, 5)

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
      isOrderSetCoverageMaxCapCheckRequired &&
      orderSetTotalClaim > orderSetCoverageMaxCap
    )
      invalidMessage.push('Order Set total claim amount has exceed the max cap')

    const total =
      medicationTotalClaim +
      consumableTotalClaim +
      vaccinationTotalClaim +
      serviceTotalClaim +
      orderSetTotalClaim

    if (total <= 0)
      invalidMessage.push('Total Claim Amount must be at least $0.01')
  }

  const maximumLimit = listOfLimits.reduce(
    (min, limit) => (limit.value <= min.value ? limit : min),
    { type: '', value: 999999 },
  )

  if (
    maximumLimit.type !== '' &&
    maximumLimit.value > 0 &&
    totalClaimAmount > maximumLimit.value
  ) {
    const _v = numeral(maximumLimit.value).format('$0,0.00')
    invalidMessage.push('Total claim amount has exceed the maximum limit:')
    invalidMessage.push(`${maximumLimit.type}: ${_v}`)
  }
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
      _prevClaimedAmount: item.error
        ? _existed._prevClaimedAmount
        : _existed._prevClaimedAmount + item.claimAmount,
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
              (oriInvoiceItem) => oriInvoiceItem.id === item.invoiceItemFK,
            )
            return {
              ...item,
              payableBalance: original
                ? original.totalAfterGst
                : item.payableBalance,
            }
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
        (itemWithSubtotal) =>
          itemWithSubtotal.invoiceItemFK === item.invoiceItemFK,
      )

      if (!_existed) return { ...item, payableBalance: item.totalAfterGst }
      return {
        ...item,
        payableBalance: _existed.error
          ? item.payableBalance
          : _existed.payableBalance - _existed._prevClaimedAmount,
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
