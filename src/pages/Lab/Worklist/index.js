import React, { Component, Fragment } from 'react'
import { connect } from 'umi'
import { Space, Card, Tabs } from 'antd'
import { Worklist } from './components/Worklist'
import { PendingSpecimen } from './PendingSpecimen'
import { WorklistContextProvider } from './WorklistContext'

const LabWorklist = props => {
  const { TabPane } = Tabs
  return (
    <Tabs type='card'>
      <TabPane tab='Worklist' key='1'>
        <Worklist {...props} />
      </TabPane>
      <TabPane tab='Pending Specimen' key='2'>
        <PendingSpecimen {...props} />
      </TabPane>
    </Tabs>
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
