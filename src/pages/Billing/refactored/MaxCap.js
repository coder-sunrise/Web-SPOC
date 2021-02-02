import React from 'react'
import { NumberInput, TextField } from '@/components'
import { INVOICE_PAYER_TYPE } from '@/utils/constants'
import MaxCapInfo from '../components/MaxCapInfo'

const MaxCap = ({
  payerTypeFK,
  claimableSchemes,
  copaymentSchemeFK,
  schemeConfig,
}) => {
  if (payerTypeFK === INVOICE_PAYER_TYPE.SCHEME || 
    payerTypeFK === INVOICE_PAYER_TYPE.PAYERACCOUNT) {
    if (schemeConfig && schemeConfig.isCoverageMaxCapCheckRequired)
      return (
        <NumberInput
          currency
          text
          prefix='Max. Cap:'
          suffix={
            <MaxCapInfo
              claimableSchemes={claimableSchemes}
              copaymentSchemeFK={copaymentSchemeFK}
            />
          }
          value={schemeConfig.coverageMaxCap}
        />
      )
    return (
      <TextField
        suffix={
          <MaxCapInfo
            claimableSchemes={claimableSchemes}
            copaymentSchemeFK={copaymentSchemeFK}
          />
        }
        prefix='Max. Cap: '
        text
      />
    )
  }
  return null
}

export default MaxCap
