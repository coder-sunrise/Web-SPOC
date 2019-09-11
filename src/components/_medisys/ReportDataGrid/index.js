import React, { memo } from 'react'
// common components
import { CommonTableGrid } from '@/components'

const ReportDataGrid = ({
  data = [],
  columns,
  height = 400,
  loading = false,
  ...restProps
}) => {
  return (
    <div style={{ width: '100%' }}>
      <CommonTableGrid
        size='sm'
        FuncProps={{
          pager: false,
        }}
        TableProps={{
          pageSize: 100,
          totalRowCount: data.length,
          loading,
        }}
        height={height}
        rows={data}
        columns={columns}
        {...restProps}
      />
    </div>
  )
}

export default memo(ReportDataGrid)
