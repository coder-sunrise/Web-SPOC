import React, { memo } from 'react'
// common component
import { CommonTableGrid } from '@/components'
// variables
import { tableConfig } from '../variables'

const TableData = ({
  title,
  height,
  columns,
  colExtensions,
  data,
  ...props
}) => {
  return (
    <React.Fragment>
      <h5>{title}</h5>
      <CommonTableGrid
        size='sm'
        // height={height}
        columns={columns}
        columnExtensions={colExtensions}
        rows={data}
        {...tableConfig}
        {...props}
      />
    </React.Fragment>
  )
}

export default memo(TableData)
