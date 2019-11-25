import React, { memo } from 'react'
// common components
import { CommonTableGrid } from '@/components'

const ReportDataGrid = ({
  data = [],
  columns,
  height = 300,
  loading = false,
  TableProps,
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
          height,
          ...TableProps,
        }}
        rows={data}
        columns={columns}
        {...restProps}
      />
    </div>
  )
}

export default memo(ReportDataGrid)
