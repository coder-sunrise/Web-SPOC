import React from 'react'
// common component
import { CommonTableGrid2 } from '@/components'
// variables
import {
  InvoiceGridData,
  InvoiceGridColExtensions,
  InvoiceGridColumns,
  TableConfig,
} from '../variables'

const InvoiceDataGrid = ({ handleRowDoubleClick }) => {
  return (
    <CommonTableGrid2
      height={600}
      rows={InvoiceGridData}
      columns={InvoiceGridColumns}
      columnExtensions={InvoiceGridColExtensions}
      onRowDoubleClick={handleRowDoubleClick}
      {...TableConfig}
    />
  )
}

export default InvoiceDataGrid
