import moment from 'moment'
import { notification } from '@/components'
import { INVOICE_ITEM_TYPE, INVOICE_PAYER_TYPE } from '@/utils/constants'

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

const getPatientCorporateScheme = (patient) => {
  const today = moment()
  return patient.patientScheme
    .filter((ps) => {
      const isExpired = today.isAfter(moment(ps.validTo))
      return !isExpired && ps.schemeTypeFK === 15
    })
    .map((item) => {
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
    if (ps.schemeTypeFK !== 15 && !isExpired) {
      const schemeType = ctschemetype.find((st) => st.id === ps.schemeTypeFK)
      const copaymentschemes = ctcopaymentscheme.filter(
        (cs) => cs.schemeTypeName === schemeType.name,
      )

      return [
        ...result,
        ...copaymentschemes.map((i) => i.id),
      ]
    }
    return [
      ...result,
    ]
  }, [])
}

export const validateApplySchemesWithPatientSchemes = (props) => {
  const {
    invoicePayers = [],
    ctcopaymentscheme = [],
    ctschemetype = [],
    patient = {},
  } = props

  try {
    const _appliedSchemes = invoicePayers.filter(
      (payer) =>
        payer.payerTypeFK === INVOICE_PAYER_TYPE.SCHEME && !payer.isCancelled,
    )
    const schemePayers = _appliedSchemes.map((item) => item.copaymentSchemeFK)
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
      const mapPatientSchemeForValidation = (ps) => {
        const isExpired = moment().isAfter(moment(ps.validTo))
        if (ps.schemeTypeFK === 15) {
          const _scheme = ctcopaymentscheme.find(
            (scheme) => scheme.id === ps.coPaymentSchemeFK,
          )
          return { name: _scheme.name, isExpired }
        }

        const _scheme = ctschemetype.find(
          (scheme) => scheme.id === ps.schemeTypeFK,
        )
        return { name: _scheme.name, isExpired }
      }
      schemes = {
        patient: patient.patientScheme.map(mapPatientSchemeForValidation),
        billing: _appliedSchemes.map((ps) => ({
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
