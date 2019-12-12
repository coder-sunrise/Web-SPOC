import React from 'react'
import { NumberInput } from '@/components'
import MaxCapInfo from '../components/MaxCapInfo'
import { INVOICE_PAYER_TYPE } from '@/utils/constants'

const MaxCap = ({
  payerTypeFK,
  claimableSchemes,
  copaymentSchemeFK,
  schemeConfig,
}) => {
  if (payerTypeFK === INVOICE_PAYER_TYPE.SCHEME) {
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
      <div style={{ display: 'flex' }}>
        <span style={{ marginRight: 8 }}>Max. Cap:</span>
        <MaxCapInfo
          claimableSchemes={claimableSchemes}
          copaymentSchemeFK={copaymentSchemeFK}
        />
      </div>
    )
  }
  return null
}

export default MaxCap
