import React from 'react'
// common component
import { CommonTableGrid } from '@/components'
// variables
import {
  InvoiceGridColExtensions,
  InvoiceGridColumns,
  TableConfig,
} from '../variables'

const getColumns = ({isEnableCHAS,isEnableMedisave})=> {
  return InvoiceGridColumns.filter(x=> {
    if(x.name === 'governmentOutstanding')
      return isEnableCHAS || isEnableMedisave
    else
      return true
  })
}

const InvoiceDataGrid = ({ handleRowDoubleClick, height, clinicSettings }) => {
  console.log('clinicSettings',clinicSettings)
  return (
    <CommonTableGrid
      type='invoiceList'
      columns={getColumns(clinicSettings)}
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
