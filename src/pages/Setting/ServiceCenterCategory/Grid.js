import React, { PureComponent } from 'react'

import { CommonTableGrid } from '@/components'

class Grid extends PureComponent {
  render () {
    const { height } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingServiceCenterCategory'
        TableProps={{
          height,
        }}
        columns={[
          { name: 'code', title: 'Code' },
          { name: 'displayValue', title: 'Display Value' },
          { name: 'description', title: 'Description' },
        ]}
        columnExtensions={[]}
      />
    )
  }
}

export default Grid
