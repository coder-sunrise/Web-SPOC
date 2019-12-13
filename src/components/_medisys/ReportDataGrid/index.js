import React, { memo } from 'react'
// common components
import { CommonTableGrid } from '@/components'

const ReportDataGrid = ({
  data = [],
  columns,
  height,
  noHeight = false,
  loading = false,
  TableProps,
  ...restProps
}) => {
  let tableProps = TableProps

  if (height) tableProps = { ...TableProps, height }

  if (height === undefined && !noHeight) {
    tableProps = { ...TableProps, height: '65vh' }
  }
  if (noHeight || (data.length <= 15 && height === undefined))
    tableProps = { ...TableProps }

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
