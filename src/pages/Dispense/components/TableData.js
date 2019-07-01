import React from 'react'
// common component
import { CommonTableGrid2 } from '@/components'
// variables
import { tableConfig } from '../variables'

const TableData = ({ title, height, columns, colExtensions, data }) => {
  return (
    <React.Fragment>
      <h5>{title}</h5>
      <CommonTableGrid2
        size='sm'
        height={height}
        columns={columns}
        columnExtensions={colExtensions}
        rows={data}
        {...tableConfig}
      />
    </React.Fragment>
  )
}

export default TableData
