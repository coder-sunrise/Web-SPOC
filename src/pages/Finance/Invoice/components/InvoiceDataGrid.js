import React from 'react'
// common component
import { CommonTableGrid } from '@/components'
// variables
import {
  InvoiceGridColExtensions,
  InvoiceGridColumns,
  TableConfig,
} from '../variables'

const InvoiceDataGrid = ({ handleRowDoubleClick, height }) => {
  return (
    <CommonTableGrid
      type='invoiceList'
      columns={InvoiceGridColumns}
      columnExtensions={InvoiceGridColExtensions}
      onRowDoubleClick={handleRowDoubleClick}
      TableProps={{
        height,
      }}
      {...TableConfig}
    />
  )
}

export default InvoiceDataGrid
