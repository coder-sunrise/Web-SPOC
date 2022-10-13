import React from 'react'
// common component
import { CommonTableGrid } from '@/components'
// variables
import {
  InvoiceGridColExtensions,
  InvoiceGridColumns,
  TableConfig,
} from '../variables'
  
const InvoiceDataGrid = ({ handleRowDoubleClick, height, clinicSettings }) => {
  console.log('clinicSettings', clinicSettings)
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
