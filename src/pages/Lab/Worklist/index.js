import React, { Component, Fragment } from 'react'
import { Space } from 'antd'
import { WorklistFilter } from './components/WorklistFilter'
import { WorklistGrid } from './components/WorklistGrid'
import { WorklistContextProvider } from './WorklistContext'

const LabWorklist = () => {
  return (
    <Space direction='vertical'>
      <WorklistFilter />
      <WorklistGrid />
    </Space>
  )
}

const LabWorklistWithProvider = props => (
  <WorklistContextProvider>
    <LabWorklist {...props}></LabWorklist>
  </WorklistContextProvider>
)

export default LabWorklistWithProvider
