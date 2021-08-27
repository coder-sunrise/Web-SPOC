import React, { useState } from 'react'
import { TextField } from '@/components'
import { formatMessage } from 'umi'

export const WorklistFilter = ({ valueChange, filterValue }) => {
  return (
    <div>
      <TextField
        label={formatMessage({ id: 'pharmacy.search.general' })}
        style={{ width: 400 }}
        onChange={valueChange}
        value={filterValue}
      />
    </div>
  )
}
