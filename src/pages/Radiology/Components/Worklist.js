import React, { Fragment, useState, useEffect } from 'react'
import { Typography, Card } from 'antd'
import ProCard from '@ant-design/pro-card'
import { Icon } from '@/components'
import { WorklistColumn } from './WorklistColumn'
import { Workitem } from './WorkItem'

export const Worklist = ({ columns }) => {
  const [columnPercentage, setColumnPercentage] = useState(100)

  useEffect(() => {
    if (columns) {
      setColumnPercentage(100 / columns.length)
    }
  }, [columns])
  window.mapped = columns
  const gridStyle = {
    gridTemplateColumns: columns.reduce(r => r + '1fr ', ''), //fraction to set same fraction for all columns
    display: 'grid',
    height: '100%',
    columnGap: 15,
  }

  const gridStyle2 = { height: '100%', display: 'flex' }

  return (
    <div style={gridStyle}>
      {columns.map((column, index) => (
        <WorklistColumn
          columnPercentage={100}
          data={column}
          renderWorkitem={Workitem}
        />
      ))}
    </div>
  )
}
