import React, { Component, Fragment } from 'react'
import { connect } from 'umi'
import { Space, Card } from 'antd'
import { PendingSpecimenFilter } from './components/PendingSpecimenFilter'
import { PendingSpecimenGrid } from './components/PendingSpecimenGrid'

export const PendingSpecimen = props => {
  return (
    <Card>
      <Space
        style={{ width: '100%', overflowY: 'scroll' }}
        direction='vertical'
      >
        <PendingSpecimenFilter {...props} />
        <PendingSpecimenGrid {...props} />
      </Space>
    </Card>
  )
}
