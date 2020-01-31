import React from 'react'
// common components
import { withVisibilityControl } from '@/components'
// sub components
import TableData from './TableData'
import { VISIT_TYPE } from '@/utils/constants'
import Authorized from '@/utils/Authorized'

@withVisibilityControl({
  hideWhen: ({ visitPurposeFK }) => visitPurposeFK === VISIT_TYPE.RETAIL,
})
class VaccinationGrid extends React.Component {
  render () {
    const accessRight = Authorized.check('queue.dispense.vaccination')

    if (accessRight && accessRight.rights === 'hidden') return null

    return <TableData {...this.props} />
  }
}

export default VaccinationGrid
