import React from 'react'
// common component
import { CommonTableGrid } from '@/components'
// variables
import {
  InvoiceGridData,
  InvoiceGridColExtensions,
  InvoiceGridColumns,
  TableConfig,
} from '../variables'

const InvoiceDataGrid = ({ handleRowDoubleClick }) => {
  return (
    <CommonTableGrid
      // height={600}
      type='invoiceList'
      // rows={InvoiceGridData}
      columns={InvoiceGridColumns}
      columnExtensions={InvoiceGridColExtensions}
      onRowDoubleClick={handleRowDoubleClick}
      {...TableConfig}
    />
  )
}

export default InvoiceDataGrid
