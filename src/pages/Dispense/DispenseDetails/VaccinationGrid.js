import React from 'react'
// sub components
import TableData from './TableData'
import Authorized from '@/utils/Authorized'

class VaccinationGrid extends React.Component {
  render () {
    const accessRight = Authorized.check('queue.dispense.vaccination')
    if ((accessRight && accessRight.rights === 'hidden') || !accessRight)
      return null

    return <TableData {...this.props} />
  }
}

export default VaccinationGrid
