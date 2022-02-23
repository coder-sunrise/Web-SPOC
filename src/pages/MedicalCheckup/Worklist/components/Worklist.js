import React, { Component, Fragment } from 'react'
import { connect } from 'umi'
import { Space, Card } from 'antd'
import { WorklistFilter } from './WorklistFilter'
import { WorklistGrid } from './WorklistGrid'

export const Worklist = props => {
  return (
    <div>
      <WorklistFilter {...props} />
      <WorklistGrid {...props} />
    </div>
  )
}
