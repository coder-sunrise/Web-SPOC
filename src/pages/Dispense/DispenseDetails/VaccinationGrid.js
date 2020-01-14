import React from 'react'
// common components
import { withVisibilityControl } from '@/components'
// sub components
import TableData from './TableData'
import { VISIT_TYPE } from '@/utils/constants'

@withVisibilityControl({
  hideWhen: ({ visitPurposeFK }) => visitPurposeFK === VISIT_TYPE.RETAIL,
})
class VaccinationGrid extends React.Component {
  render () {
    return <TableData {...this.props} />
  }
}

export default VaccinationGrid
