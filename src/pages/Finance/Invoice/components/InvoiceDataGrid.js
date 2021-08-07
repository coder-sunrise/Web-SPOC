import React from 'react'
// common component
import { CommonTableGrid } from '@/components'
// variables
import {
  InvoiceGridColExtensions,
  InvoiceGridColumns,
  TableConfig,
} from '../variables'

const getColumns = (isEnableCHAS)=> {
  return InvoiceGridColumns.filter(x=> {
    if(x.name === 'governmentOutstanding')
      return isEnableCHAS
    else
      return true
  })
}

const InvoiceDataGrid = ({ handleRowDoubleClick, height, isEnableCHAS }) => {
  return (
    <CommonTableGrid
      type='invoiceList'
      columns={getColumns(isEnableCHAS)}
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
