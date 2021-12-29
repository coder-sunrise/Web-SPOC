import React, { Component, Fragment } from 'react'
import { connect } from 'umi'
import { Space, Card, Tabs } from 'antd'
import { WorklistFilter } from './WorklistFilter'
import { WorklistGrid } from './WorklistGrid'

export const Worklist = props => {
  const { TabPane } = Tabs
  return (
    <Card>
      <Space
        style={{ width: '100%', overflowY: 'scroll' }}
        direction='vertical'
      >
        <WorklistFilter {...props} />
        <WorklistGrid {...props} />
      </Space>
    </Card>
  )
}
