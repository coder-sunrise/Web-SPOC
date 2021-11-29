import React, { Component, Fragment } from 'react'
import { connect } from 'umi'
import { Space } from 'antd'
import { WorklistFilter } from './components/WorklistFilter'
import { WorklistGrid } from './components/WorklistGrid'
import { WorklistContextProvider } from './WorklistContext'

const LabWorklist = props => {
  return (
    <Space style={{ width: '100%' }} direction='vertical'>
      <WorklistFilter {...props} />
      <WorklistGrid {...props} />
    </Space>
  )
}

const LabWorklistWithProvider = props => (
  <WorklistContextProvider>
    <LabWorklist {...props}></LabWorklist>
  </WorklistContextProvider>
)

const ConnectedLabWorklistWithProvider = connect(
  ({ labWorklist, codetable, clinicSettings }) => ({
    labWorklist,
    codetable,
    clinicSettings: clinicSettings.settings || clinicSettings.default,
  }),
)(LabWorklistWithProvider)

export default ConnectedLabWorklistWithProvider
