import React, { Component, Fragment } from 'react'
import { connect } from 'umi'
import { Space, Card } from 'antd'
import { Worklist } from './components/Worklist'
import { WorklistContextProvider } from './WorklistContext'

const LabWorklist = props => {
  return <Worklist {...props} />
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
