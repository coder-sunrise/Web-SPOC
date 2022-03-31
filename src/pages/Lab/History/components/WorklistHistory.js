import React, { Component, Fragment } from 'react'
import { connect } from 'umi'
import { Space, Card } from 'antd'
import { WorklistHistoryFilter } from './WorklistHistoryFilter'
import { WorklistHistoryGrid } from './WorklistHistoryGrid'

export const WorklistHistory = props => {
  return (
    <Card>
      <Space direction='vertical' style={{ width: '100%' }}>
        <WorklistHistoryFilter {...props} />
        <WorklistHistoryGrid {...props} />
      </Space>
    </Card>
  )
}
