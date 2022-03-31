import React, { Component, Fragment } from 'react'
import { connect } from 'umi'
import { Space, Card } from 'antd'
import { WorklistHistory } from './components/WorklistHistory'
import { WorklistHistoryContextProvider } from './WorklistHistoryContext'

const LabWorklistHistory = props => {
  return <WorklistHistory {...props}></WorklistHistory>
}

const LabWorklistHistoryWithProvider = props => (
  <WorklistHistoryContextProvider>
    <LabWorklistHistory {...props}></LabWorklistHistory>
  </WorklistHistoryContextProvider>
)

const ConnectedLabWorklist = connect(({ labWorklistHistory, codetable }) => ({
  labWorklistHistory,
  codetable,
}))(LabWorklistHistoryWithProvider)

export default ConnectedLabWorklist
