import React from 'react'
// common components
import { NumberInput, TextField } from '@/components'

const BalanceLabel = ({ schemeConfig }) => {
  const { balance = null, balanceStatusCode } = schemeConfig
  if (balanceStatusCode && balanceStatusCode.toUpperCase() === 'SC105') {
    return <TextField text prefix='Balance:' value='Full Balance' />
  }
  return <NumberInput currency text prefix='Balance:' value={balance} />
}
export default BalanceLabel
