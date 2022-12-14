import moment from 'moment'
import { notification } from '@/components'
import { INVOICE_ITEM_TYPE, INVOICE_PAYER_TYPE } from '@/utils/constants'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
import { SCHEME_TYPE } from '@/utils/constants'
import { roundTo } from '@/utils/utils'

export const constructPayload = values => {
  const {
    concurrencyToken,
    visitId,
    visitPurposeFK,
    visitStatus = VISIT_STATUS.BILLING,
    invoice,
    invoicePayer = [],
    invoicePayment = [],
    mode,
    signatureName,
    signature,
    consReady,
  } = values
  const { invoiceItems, ...restInvoice } = invoice
  const gstValue = invoice.gstValue || 0
  const isGstInclusive = invoice.isGstInclusive || 0
  let _invoicePayer = invoicePayer.filter(payer => {
    if (payer.id === undefined && payer.isCancelled) return false
    return true
  })

  let newsequence = -1
  for (let index = 0; index < _invoicePayer.length; index++) {
    if (_invoicePayer[index].id) {
      newsequence = _invoicePayer[index].sequence
    } else {
      newsequence += 1
      _invoicePayer[index].sequence = newsequence
    }
  }
  _invoicePayer = _invoicePayer.filter(payer =>
    payer.id ? payer.isModified : true,
  )
  _invoicePayer = _invoicePayer.map((payer, index) => {
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
    // let invoicePayerGstAmount = 0
    const _payer = {
      ...restPayer,
      isModified: restPayer.id ? isModified : false,
      invoicePayerItem: payer.invoicePayerItem
        .filter(item => item.claimAmountBeforeGST > 0)
        .map(item => {
          if (typeof item.id !== 'string') {
            const actualGSTAmount = isGstInclusive
              ? roundTo(
                  item.claimAmountBeforeGST -
                    item.claimAmountBeforeGST / (1 + gstValue / 100),
                )
              : roundTo((item.claimAmountBeforeGST * gstValue) / 100)
            const gstAmount = isGstInclusive ? 0 : actualGSTAmount
            return {
              ...item,
              claimAmount: item.claimAmountBeforeGST + gstAmount,
              outstanding: item.claimAmountBeforeGST + gstAmount,
            }
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
            claimAmountBeforeGST,
            id,
            ...restItem
          } = item
          const actualGSTAmount = isGstInclusive
            ? roundTo(
                claimAmountBeforeGST -
                  claimAmountBeforeGST / (1 + gstValue / 100),
              )
            : roundTo((claimAmountBeforeGST * gstValue) / 100)
          const gstItemAmount = isGstInclusive ? 0 : actualGSTAmount
          const _invoicePayerItem = {
            ...restItem,
            invoiceItemFK,
            claimAmountBeforeGST: claimAmountBeforeGST,
            claimAmount: claimAmountBeforeGST + gstItemAmount,
            outstanding: claimAmountBeforeGST + gstItemAmount,
            payableBalance,
            invoiceItemTypeFK,
            itemName: itemDescription,
          }
          return _invoicePayerItem
        }),
    }
    _payer.gstAmount = isGstInclusive
      ? roundTo(
          _payer.payerDistributedAmtBeforeGST -
            _payer.payerDistributedAmtBeforeGST / (1 + gstValue / 100),
        )
      : roundTo((_payer.payerDistributedAmtBeforeGST * gstValue) / 100)
    const gstAmount = isGstInclusive ? 0 : _payer.gstAmount
    _payer.payerDistributedAmt = _payer.payerDistributedAmtBeforeGST + gstAmount
    return _payer
  })

  const payload = {
    visitPurposeFK,
    mode,
    concurrencyToken,
    visitId,
    visitStatus,
    consReady,
    invoicePayment: invoicePayment
      .filter(item => {
        if (item.id && item.isCancelled) return true
        if (!item.id) return true
        return false
      })
      .map(item => ({
        ...item,
        invoicePayerFK: undefined,
      })),
    invoice: restInvoice,
    invoicePayer: _invoicePayer,
  }
  return payload
}

const getPatientCorporateScheme = patient => {
  const today = moment()
  return patient.patientScheme
    .filter(ps => {
      const isExpired = today.isAfter(moment(ps.validTo))
      return (
        !isExpired &&
        [SCHEME_TYPE.CORPORATE, SCHEME_TYPE.INSURANCE].indexOf(
          ps.schemeTypeFK,
        ) >= 0
      )
    })
    .map(item => {
      return item.coPaymentSchemeFK
    })
}

const getPatientGovernmentScheme = ({
  patient,
  ctcopaymentscheme,
  ctschemetype,
}) => {
  const today = moment()
  return patient.patientScheme.reduce((result, ps) => {
    const isExpired = today.isAfter(moment(ps.validTo))
    if (
      [SCHEME_TYPE.CORPORATE, SCHEME_TYPE.INSURANCE].indexOf(ps.schemeTypeFK) <
        0 &&
      !isExpired
    ) {
      const schemeType = ctschemetype.find(st => st.id === ps.schemeTypeFK)
      const copaymentschemes = ctcopaymentscheme.filter(
        cs => cs.schemeTypeName === schemeType.name,
      )

      return [...result, ...copaymentschemes.map(i => i.id)]
    }
    return [...result]
  }, [])
}

export const validateApplySchemesWithPatientSchemes = props => {
  const {
    invoicePayers = [],
    ctcopaymentscheme = [],
    ctschemetype = [],
    patient = {},
  } = props

  try {
    const _appliedSchemes = invoicePayers.filter(
      payer =>
        payer.payerTypeFK === INVOICE_PAYER_TYPE.SCHEME && !payer.isCancelled,
    )
    const schemePayers = _appliedSchemes.map(item => item.copaymentSchemeFK)
    const patientCorporateSchemes = getPatientCorporateScheme(patient)
    const patientGovernmentSchemes = getPatientGovernmentScheme({
      ctcopaymentscheme,
      ctschemetype,
      patient,
    })
    const patientSchemes = [
      ...patientCorporateSchemes,
      ...patientGovernmentSchemes,
    ]

    const checkIfPatientSchemesIncludesAppliedScheme = (result, schemeFK) => {
      if (!patientSchemes.includes(schemeFK)) return true
      return result
    }
    const doesNotMatch = schemePayers.reduce(
      checkIfPatientSchemesIncludesAppliedScheme,
      false,
    )

    let schemes = { patient: [], billing: [] }

    if (doesNotMatch) {
      const mapPatientSchemeForValidation = ps => {
        const isExpired = moment().isAfter(moment(ps.validTo))
        if (
          [SCHEME_TYPE.CORPORATE, SCHEME_TYPE.INSURANCE].indexOf(
            ps.schemeTypeFK,
          ) >= 0
        ) {
          const _scheme = ctcopaymentscheme.find(
            scheme => scheme.id === ps.coPaymentSchemeFK,
          )
          return { name: _scheme.name, isExpired }
        }

        const _scheme = ctschemetype.find(
          scheme => scheme.id === ps.schemeTypeFK,
        )
        return { name: _scheme.name, isExpired }
      }
      schemes = {
        patient: patient.patientScheme.map(mapPatientSchemeForValidation),
        billing: _appliedSchemes.map(ps => ({
          name: ps.name,
          isExpired: false,
          isDeleted: !patientSchemes.includes(ps.copaymentSchemeFK),
        })),
      }
    }

    return { doesNotMatch, schemes }
  } catch (error) {
    notification.error({
      message: 'Failed to validate schemes',
    })
    throw error
  }
}
