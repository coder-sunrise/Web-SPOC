import React, { PureComponent } from 'react'
// custom component
import { CommonTableGrid2 } from '@/components'

const data = []

class DetailGrid extends PureComponent {
  state = {
    tableProps: {
      columns: [
        { name: 'noteNo', title: 'Credit/Debit Note No.' },
        { name: 'date', title: 'Credit/Debit Note No.' },
        { name: 'name', title: 'Credit/Debit Note No.' },
        { name: 'nric', title: 'Credit/Debit Note No.' },
        { name: 'action', title: 'Action' },
      ],
    },
  }

  render () {
    const { tableProps } = this.state
    return <CommonTableGrid2 rows={data} {...tableProps} />
  }
}

export default DetailGrid
