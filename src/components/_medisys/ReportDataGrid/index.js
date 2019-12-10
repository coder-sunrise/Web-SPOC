import React, { memo } from 'react'
// common components
import { CommonTableGrid } from '@/components'

const ReportDataGrid = ({
  data = [],
  columns,
  height,
  loading = false,
  TableProps,
  ...restProps
}) => {
  let tableProps = TableProps
  if (height === undefined) {
    tableProps = { ...TableProps, height: '65vh' }
  }
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
          ...tableProps,
        }}
        rows={data}
        columns={columns}
        {...restProps}
      />
    </div>
  )
}

export default memo(ReportDataGrid)
